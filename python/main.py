from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from exceptions import InvalidArg
from predict import do_predictions
from google.cloud import secretmanager

project_id = "102484244946"
secret_id = "SOCRATA_APP_TOKEN"
name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
client = secretmanager.SecretManagerServiceClient()
appToken = client.access_secret_version(request={"name": name}).payload.data.decode(
    "UTF-8"
)

app = Flask(__name__)
CORS(
    app,
    origins=["https://c964-capstone.vercel.app", "http://localhost:3001"],
)


@app.route("/")
@cross_origin()
def helloWorld():
    print("Hello from here!!!!!!!!!!!!!")
    return "Hello, world!"


@app.route("/predict")
@cross_origin()
def do_predict():
    # Get params from the request
    # borough = request.args.get("borough")
    data_source = f"https://data.cityofnewyork.us/resource/rc75-m7u3.csv?$$app_token={appToken}&$limit=5000"
    gcs_bucket_name = "capstone-models"
    results = do_predictions(data_source, gcs_bucket_name)
    return jsonify(results)


if __name__ == "__main__":
    # Used when running locally only. When deploying to Cloud Run,
    # a webserver process such as Gunicorn will serve the app.
    app.run(host="0.0.0.0", port=8080, debug=True)


@app.errorhandler(InvalidArg)
def handle_invalid_arg(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
