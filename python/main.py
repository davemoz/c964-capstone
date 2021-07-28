from flask import Flask, request
from flask_cors import CORS
import predict

app = Flask(__name__)
CORS(app)


@app.route("/")
def do_predict():
    # If we need to load params from the request
    request_args = request.args
    data = predict.process_covid_prediction(request_args)
    return data


if __name__ == "__main__":
    # Used when running locally only. When deploying to Cloud Run,
    # a webserver process such as Gunicorn will serve the app.
    app.run(host="0.0.0.0", port=8080, debug=True)
