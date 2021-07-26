def process_covid_prediction(args):
    import time
    # import multiprocessing
    # from joblib import Parallel, delayed
    import math
    import numpy as np
    import pandas as pd
    import tensorflow as tf
    from pandas import read_csv
    from sklearn.preprocessing import MinMaxScaler
    from tensorflow.keras import layers

    # num_cores = multiprocessing.cpu_count()

    start_time = time.time()

    # Load dataset
    NYC_COVID_DATA_CSV = "https://data.cityofnewyork.us/resource/rc75-m7u3.csv"
    names = ['date_of_interest', 'bx_case_count',
             'bx_hospitalized_count', 'bx_death_count']
    df = read_csv(NYC_COVID_DATA_CSV, header=0,
                  parse_dates=['date_of_interest'])

    # Separate the data into boroughs
    dates = df.filter('date_of_interest')
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
        # Convert the dataframes to numpy arrays
        ds = data.values
        # Get the number of rows to train the model on
        training_data_len = math.ceil(len(ds) * .8)
        training_data_len
        # Scale the data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(ds)
        scaled_data
        # Create the training data sets
        # Create the scaled training data set
        train_data = scaled_data[0:training_data_len, :]
        # Split the data into x_train and y_train data set
        x_train = []
        y_train = []
        for i in range(60, len(train_data)):
            x_train.append(train_data[i-60:i, 0])
            y_train.append(train_data[i, 0])
        # Convert the x_train and y_train to numpy arrays
        x_train, y_train = np.array(x_train), np.array(y_train)
        # Reshape the data
        x_train = np.reshape(
            x_train, (x_train.shape[0], x_train.shape[1], 1))
        x_train.shape
        # Build the LSTM model
        model = tf.keras.Sequential(
            [
                layers.LSTM(50, return_sequences=True,
                            input_shape=(x_train.shape[1], 1)),
                layers.LSTM(50, return_sequences=False),
                layers.Dense(25),
                layers.Dense(1)
            ]
        )
        # Compile the model
        model.compile(optimizer=tf.optimizers.Adam(),
                      loss=tf.losses.MeanSquaredError())
        # Train the model
        model.fit(x_train, y_train, batch_size=1, epochs=1)
        # Create the testing data set
        # Create a new array containing scaled values from index 344 to 504
        test_data = scaled_data[training_data_len - 60:, :]
        # Create the data sets x_test and y_test
        x_test = []
        y_test = ds[training_data_len:, :]
        for i in range(60, len(test_data)):
            x_test.append(test_data[i-60:i, 0])
        # Convert the data to a numpy array
        x_test = np.array(x_test)
        # Reshape the data
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
        # Get the model's predicted case values
        predictions = model.predict(x_test)
        predictions = scaler.inverse_transform(predictions)
        # Get the root mean squared error (RMSE)
        # rmse = np.sqrt( np.mean( (predictions - y_test)**2 ) )
        # Get the data for plotting
        trainObj = {}
        validObj = {}
        trainObj['training'] = [item for sublist in (
            data[:training_data_len].to_numpy().tolist()) for item in sublist]
        validObj['actual'] = [item for sublist in (
            data[training_data_len:].to_numpy().tolist()) for item in sublist]
        validObj['predictions'] = [item for sublist in predictions.tolist()
                                   for item in sublist]
        total_run_time = time.time() - start_time
        all_borough_data[borough] = [
            {'run_time': total_run_time}, trainObj, validObj]

    # parallelData = Parallel(n_jobs=num_cores)(
    #     delayed(do_predictions)(borough) for borough in boroughs)

    return all_borough_data, args
