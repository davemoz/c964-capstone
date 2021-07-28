const NYC_COVID_DATA_JSON =
  "https://data.cityofnewyork.us/resource/rc75-m7u3.json";

const NYC_BOROUGH_BOUNDARIES_JSON =
  "https://data.cityofnewyork.us/resource/7t3b-ywvw.json";

const GEOAPIFY_API_URL =
  "https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?";

const GEOAPIFY_API_KEY = "75d1e67dfac740bbb520fc3e83d32145";

const GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT = // "http://10.0.0.35:8080";
  "https://predict-74fywbojmq-uk.a.run.app";

export {
  NYC_COVID_DATA_JSON,
  NYC_BOROUGH_BOUNDARIES_JSON,
  GEOAPIFY_API_URL,
  GEOAPIFY_API_KEY,
  GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT,
};
