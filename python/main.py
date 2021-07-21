import flask
import math
import numpy as np
import pandas as pd
import tensorflow as tf
from pandas import read_csv
from sklearn.preprocessing import MinMaxScaler
from tf.keras.models import Sequential
from tf.keras.layers import Dense, LSTM


def process_covid_prediction(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # If we need to load params from the request
    # request_json = request.get_json(silent=True)
    # request_args = request.args
    # if request_json and 'date' in request_json:
    #     date = request_json['date']
    # elif request_args and 'date' in request_args:
    #     date = request_args['date']
    # else:
    #     raise ValueError(
    #         'JSON is invalid or missing a "date" property.')

    # Load dataset
    NYC_COVID_DATA_CSV = "https://data.cityofnewyork.us/resource/rc75-m7u3.csv"
    names = ['date_of_interest', 'bx_case_count',
             'bx_hospitalized_count', 'bx_death_count']
    df = read_csv(NYC_COVID_DATA_CSV, header=0,
                  parse_dates=['date_of_interest'])

    # Separate the data into boroughs
    dates = df.filter('date_of_interest')
    bx_names = ['bx_case_count', 'bx_hospitalized_count', 'bx_death_count']
    bk_names = ['bk_case_count', 'bk_hospitalized_count', 'bk_death_count']
    mn_names = ['mn_case_count', 'mn_hospitalized_count', 'mn_death_count']
    qn_names = ['qn_case_count', 'qn_hospitalized_count', 'qn_death_count']
    si_names = ['si_case_count', 'si_hospitalized_count', 'si_death_count']
    boroughs = {'bx': bx_names, 'bk': bk_names,
                'mn': mn_names, 'qn': qn_names, 'si': si_names}

    returnData = []

    for borough in boroughs:
        data = df.filter(boroughs[borough])
        returnData.append(data)

    return (returnData, 200, headers)
