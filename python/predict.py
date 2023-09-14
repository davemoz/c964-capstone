import math
import os
import numpy as np
import pandas as pd
import tensorflow as tf
from pandas import read_csv
from sklearn.preprocessing import MinMaxScaler
from keras import layers
from google.cloud import storage

# Initialize the GCP Storage client
storage_client = storage.Client()


def load_covid_data(data_source):
    df = read_csv(data_source, header=0, parse_dates=["date_of_interest"])
    return df


def prepare_data(data, num_training_days=60):
    scaler = MinMaxScaler(feature_range=(0, 1))
    training_data_len = math.ceil(len(data) * 0.8)
    train_df = data.iloc[0:training_data_len, :]

    scaled_train_data = scaler.fit_transform(train_df.values.reshape(-1, 1))

    x_train, y_train = [], []
    for i in range(num_training_days, len(scaled_train_data)):
        x_train.append(scaled_train_data[i - num_training_days : i, 0])
        y_train.append(scaled_train_data[i, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    return x_train, y_train, training_data_len, train_df, scaled_train_data, scaler


def create_lstm_model(input_shape):
    model = tf.keras.Sequential(
        [
            layers.LSTM(units=50, return_sequences=True, input_shape=input_shape),
            layers.Dropout(0.2),
            layers.LSTM(units=50, return_sequences=True),
            layers.Dropout(0.2),
            layers.LSTM(units=50),
            layers.Dense(1),
        ]
    )
    model.compile(optimizer=tf.optimizers.Adam(), loss=tf.losses.MeanSquaredError())
    return model


def train_model(
    model, x_train, y_train, batch_size=1, epochs=1, model_checkpoint_path=None
):
    print(f"Training using model_checkpoint_path: {model_checkpoint_path}")
    callbacks = []
    if model_checkpoint_path:
        # Create a ModelCheckpoint callback to save the model during training
        callbacks.append(
            tf.keras.callbacks.ModelCheckpoint(
                model_checkpoint_path, save_best_only=True, save_weights_only=False
            )
        )

    model.fit(
        x_train, y_train, batch_size=batch_size, epochs=epochs, callbacks=callbacks
    )
    return model


def evaluate_model(
    model, data, scaler, training_data_len, train_df, num_training_days=60
):
    test_df = data.iloc[training_data_len:, :]
    actual_case_nums = test_df.values

    total_dataset = pd.concat((train_df, test_df), axis=0)
    model_inputs = total_dataset[
        len(total_dataset) - len(test_df) - num_training_days :
    ].values
    model_inputs = model_inputs.reshape(-1, 1)
    model_inputs = scaler.transform(model_inputs)

    x_test = []
    for i in range(num_training_days, len(model_inputs)):
        x_test.append(model_inputs[i - num_training_days : i, 0])

    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    predicted_cases = model.predict(x_test)
    predicted_cases = scaler.inverse_transform(predicted_cases)

    real_data = [
        model_inputs[len(model_inputs) + 1 - num_training_days : len(model_inputs), 0]
    ]
    real_data = np.array(real_data)
    real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))

    prediction = model.predict(real_data)
    prediction = scaler.inverse_transform(prediction)

    return actual_case_nums, predicted_cases, prediction


def create_data_export(
    scaled_train_data, actual_case_nums, predicted_cases, prediction, scaler
):
    """Creates the array and object for export to the frontend"""
    exportObj = {}
    exportObj["training"] = [
        item
        for sublist in (scaler.inverse_transform(scaled_train_data).tolist())
        for item in sublist
    ]
    exportObj["actual"] = [
        item for sublist in (actual_case_nums.tolist()) for item in sublist
    ]
    exportObj["predictions"] = [
        item for sublist in (predicted_cases.tolist()) for item in sublist
    ]
    exportObj["prediction"] = [
        item for sublist in (prediction.tolist()) for item in sublist
    ]

    return exportObj


def save_model_to_gcs(model, gcs_bucket_name, model_filename):
    """Saves the model to Google Cloud Storage."""
    bucket = storage_client.bucket(gcs_bucket_name)
    blob = bucket.blob(model_filename)
    cwd = os.getcwd()
    temppath = f"{cwd}/temp/"
    modelpath = f"{model_filename}.keras"
    fullpath = f"{temppath}{modelpath}"
    print(f"Attempting to save {fullpath} to GCS...")
    os.makedirs(os.path.dirname(temppath), exist_ok=True)
    model.save(fullpath, save_format="keras")
    blob.upload_from_filename(fullpath)
    print(f"{fullpath} successfully uploaded to GCS:{gcs_bucket_name}")


def load_model_from_gcs(gcs_bucket_name, model_filename):
    """Loads the model from Google Cloud Storage."""
    bucket = storage_client.bucket(gcs_bucket_name)
    blob = bucket.blob(model_filename)
    cwd = os.getcwd()
    temppath = f"{cwd}/temp/"
    modelpath = f"{model_filename}.keras"
    fullpath = f"{temppath}{modelpath}"
    blob.download_to_filename(f"{fullpath}")
    return tf.keras.models.load_model(f"{fullpath}")


def do_predictions(data_source, gcs_bucket_name):
    df = load_covid_data(data_source)
    all_borough_data = []

    boroughs = {
        "bx": ["bx_case_count"],
        "bk": ["bk_case_count"],
        "mn": ["mn_case_count"],
        "qn": ["qn_case_count"],
        "si": ["si_case_count"],
    }

    for borough, col_names in boroughs.items():
        # Get all data for each borough
        data = df.filter(col_names)
        (
            x_train,
            y_train,
            training_data_len,
            train_df,
            scaled_train_data,
            scaler,
        ) = prepare_data(data)
        print(f"{borough}: Prepared data.")

        model_filename = f"{borough}_model"
        model = None
        print(f"Checking GCS for existing model: {borough}_model")
        try:
            model = load_model_from_gcs(gcs_bucket_name, model_filename)
            print(f"Loaded pre-trained model: {model_filename}")
        except Exception as e:
            print("No pre-trained model found.")
            print(f"Error: {e}")
            model = create_lstm_model((x_train.shape[1], 1))

        print(f"{borough}: Training...")
        cwd = os.getcwd()
        temppath = f"{cwd}/temp/"
        model_checkpoint_path = f"{temppath}training/{borough}_cp.ckpt"
        os.makedirs(os.path.dirname(model_checkpoint_path), exist_ok=True)
        model = train_model(
            model, x_train, y_train, model_checkpoint_path=model_checkpoint_path
        )

        # Save the model to GCS for reuse
        save_model_to_gcs(model, gcs_bucket_name, model_filename)

        actual_case_nums, predicted_cases, prediction = evaluate_model(
            model, data, scaler, training_data_len, train_df
        )

        all_borough_data.append(
            {
                borough: create_data_export(
                    scaled_train_data,
                    actual_case_nums,
                    predicted_cases,
                    prediction,
                    scaler,
                )
            }
        )

    return all_borough_data
