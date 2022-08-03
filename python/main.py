from flask import Flask, request, jsonify
from flask_cors import CORS
from exceptions import InvalidArg
import predict

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[
     "https://c964-capstone.vercel.app"])


@app.route("/")
def do_predict():
    # If we need to load params from the request
    request_args = request.args
    borough = request_args.borough
    if not borough:
        raise InvalidArg('Borough argument is missing.', status_code=410)
    data = predict.process_covid_prediction(borough)
    return data


if __name__ == "__main__":
    # Used when running locally only. When deploying to Cloud Run,
    # a webserver process such as Gunicorn will serve the app.
    app.run(host="0.0.0.0", port=8080, debug=True)


@app.errorhandler(InvalidArg)
def handle_invalid_arg(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
