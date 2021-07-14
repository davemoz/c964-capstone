#!/usr/bin/env python3

import scipy
import numpy
import matplotlib
import pandas as pd
import sklearn

# Load libraries
from pandas import read_csv
from pandas.plotting import scatter_matrix
from matplotlib import pyplot
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC


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

    # Load dataset
    NYC_COVID_DATA_CSV = "https://data.cityofnewyork.us/resource/rc75-m7u3.csv"
    names = ['date_of_interest', 'all_case_count_7day_avg',
             'bx_all_case_count_7day_avg', 'bk_all_case_count_7day_avg', 'mn_all_case_count_7day_avg', 'qn_all_case_count_7day_avg', 'si_all_case_count_7day_avg']
    dataset = read_csv(NYC_COVID_DATA_CSV, names=names,
                       header=0, usecols=names, parse_dates=['date_of_interest'])

    # request_json = request.get_json(silent=True)
    # request_args = request.args
    # if request_json and 'date' in request_json:
    #     date = request_json['date']
    # elif request_args and 'date' in request_args:
    #     date = request_args['date']
    # else:
    #     raise ValueError(
    #         'JSON is invalid or missing a "date" property.')

    print("Hello Dave.")

    # histograms
    dataset.hist()
    pyplot.show(block=True)

    # Split out validation dataset
    # array = dataset.values
    # X = array[:, 0:6]
    # Y = array[:, 6]
    # X_train, X_validation, Y_train, Y_validation = train_test_split(
    #     X, Y, test_size=0.20, random_state=1)

    # # Spot Check Algorithms
    # models = []
    # models.append(('LR', LogisticRegression(
    #     solver='liblinear', multi_class='ovr')))
    # models.append(('LDA', LinearDiscriminantAnalysis()))
    # models.append(('KNN', KNeighborsClassifier()))
    # models.append(('CART', DecisionTreeClassifier()))
    # models.append(('NB', GaussianNB()))
    # models.append(('SVM', SVC(gamma='auto')))
    # # evaluate each model in turn
    # results = []
    # names = []
    # for name, model in models:
    #     kfold = StratifiedKFold(n_splits=10, random_state=1, shuffle=True)
    #     cv_results = cross_val_score(
    #         model, X_train, Y_train, cv=kfold, scoring='accuracy')
    #     results.append(cv_results)
    #     names.append(name)
    #     print('%s: %f (%f)' % (name, cv_results.mean(), cv_results.std()))

    # returnData = dataset.head(20).to_json()

    # return (returnData, 200, headers)
