def process_covid_prediction(args):
    import datetime
    import math
    # import multiprocessing
    # from joblib import Parallel, delayed
    import numpy as np
    import pandas as pd
    import tensorflow as tf
    from pandas import read_csv
    from sklearn.preprocessing import MinMaxScaler
    from tensorflow.keras import layers

    # num_cores = multiprocessing.cpu_count()

    # Load dataset
    NYC_COVID_DATA_CSV = "https://data.cityofnewyork.us/resource/rc75-m7u3.csv"
    df = read_csv(NYC_COVID_DATA_CSV, header=0,
                  parse_dates=['date_of_interest'])

    # Get all data
    all_case_count = df.filter(['case_count'])

    # Separate the data into boroughs
    bx_names = ['bx_case_count']
    bk_names = ['bk_case_count']
    mn_names = ['mn_case_count']
    qn_names = ['qn_case_count']
    si_names = ['si_case_count']
    boroughs = {'bx': bx_names, 'bk': bk_names,
                'mn': mn_names, 'qn': qn_names, 'si': si_names}

    all_borough_data = {}
    # Create model, train, and predict for each borough
    # def do_predictions(borough):
    for borough in boroughs:
        data = df.filter(boroughs[borough])

        # Create a training sub-dataset
        training_data_len = math.ceil(len(data) * .8)
        train_df = data.iloc[0:training_data_len, :]
        # Scale the data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_train_data = scaler.fit_transform(
            train_df.values.reshape(-1, 1))
        # Create the training data sets
        # Set number of days to "look back" for training
        num_training_days = 60
        # Split the data into x_train and y_train data set
        x_train = []
        y_train = []
        for i in range(num_training_days, len(scaled_train_data)):
            x_train.append(scaled_train_data[i-num_training_days:i, 0])
            y_train.append(scaled_train_data[i, 0])
        # Convert the x_train and y_train to numpy arrays
        x_train, y_train = np.array(x_train), np.array(y_train)
        # Reshape the data
        x_train = np.reshape(
            x_train, (x_train.shape[0], x_train.shape[1], 1))
        # Build the LSTM model
        # model = tf.keras.Sequential(
        #     [
        #         layers.LSTM(50, return_sequences=True,
        #                     input_shape=(x_train.shape[1], 1)),
        #         layers.LSTM(50, return_sequences=False),
        #         layers.Dense(25),
        #         layers.Dense(1)
        #     ]
        # )
        model = tf.keras.Sequential(
            [
                layers.LSTM(units=50, return_sequences=True,
                            input_shape=(x_train.shape[1], 1)),
                layers.Dropout(0.2),
                layers.LSTM(units=50, return_sequences=True),
                layers.Dropout(0.2),
                layers.LSTM(units=50),
                layers.Dense(1)  # Prediction of the next case value
            ]
        )
        # Compile the model
        model.compile(optimizer=tf.optimizers.Adam(),
                      loss=tf.losses.MeanSquaredError())
        # Train the model
        model.fit(x_train, y_train, batch_size=1, epochs=1)

        ''' Test The Model Accuracy on Existing Data '''
        # Create the testing dataframe
        test_df = data.iloc[training_data_len:, :]
        # Create a numpy array of actual case numbers
        actual_case_nums = test_df.values
        # Create combined dataset of training & test data (not scaled)
        total_dataset = pd.concat((train_df, test_df), axis=0)
        # Create prepared inputs for model
        model_inputs = total_dataset[len(
            total_dataset) - len(test_df) - num_training_days:].values
        model_inputs = model_inputs.reshape(-1, 1)
        model_inputs = scaler.transform(model_inputs)
        # Create the data sets x_test and y_test
        x_test = []
        for i in range(num_training_days, len(model_inputs)):
            x_test.append(model_inputs[i-num_training_days:i, 0])
        # Convert the data to a numpy array
        x_test = np.array(x_test)
        # Reshape the data
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
        # Get the predicted cases
        predicted_cases = model.predict(x_test)
        predicted_cases = scaler.inverse_transform(predicted_cases)
        # Predict Next Day
        real_data = [
            model_inputs[len(model_inputs) + 1 - num_training_days:len(model_inputs), 0]]
        real_data = np.array(real_data)
        real_data = np.reshape(
            real_data, (real_data.shape[0], real_data.shape[1], 1))

        prediction = model.predict(real_data)
        prediction = scaler.inverse_transform(prediction)
        # Export data for frontend
        exportObj = {}
        # trainObj['training'] = [item for sublist in (
        #     data[:training_data_len].to_numpy().tolist()) for item in sublist]
        # validObj['validation'] = [item for sublist in (
        #     data[training_data_len:].to_numpy().tolist()) for item in sublist]
        # validObj['predictions'] = [item for sublist in predicted_cases.tolist()
        #                            for item in sublist]
        exportObj['training'] = [item for sublist in (
            scaler.inverse_transform(scaled_train_data).tolist()) for item in sublist]
        exportObj['actual'] = [item for sublist in (
            actual_case_nums.tolist()) for item in sublist]
        exportObj['predictions'] = [item for sublist in (
            predicted_cases.tolist()) for item in sublist]
        exportObj['prediction'] = [item for sublist in (
            prediction.tolist()) for item in sublist]

        all_borough_data[borough] = exportObj

    # parallelData = Parallel(n_jobs=num_cores)(
    #     delayed(do_predictions)(borough) for borough in boroughs)

    return all_borough_data
