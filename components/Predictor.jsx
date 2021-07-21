import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT } from "../utils/constants";

import Spinner from "./Spinner";

import styles from "../styles/Predictor.module.scss";

const Predictor = () => {
  const [prediction, setPrediction] = useState(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);

  const _handlePredictionTrigger = (args) => {
    const fetchProcessedData = async () => {
      setIsPredictionLoading(true);
      if (prediction) {
        setIsPredictionLoading(false);
        return prediction;
      }

      let args_string = args ? "?" : "";
      args &&
        Object.keys(args).map((key, idx) => {
          idx === Object.keys(args).length - 1
            ? (args_string += `${key}=${args[key]}`)
            : (args_string += `${key}=${args[key]}&`);
        });

      try {
        const res = await fetch(
          GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT + `${args_string}`
        );
        const data = res.json();
        setPrediction(data);
        setIsPredictionLoading(false);
      } catch (error) {
        setIsPredictionLoading(false);
        throw new Error(`There was an error fetching the data: ${error}`);
      }
    };
    fetchProcessedData();
  };

  const _handleResetTrigger = () => {
    setPrediction(null);
  };

  return (
    <div className="results_box">
      {!prediction ? (
        <div className={styles.trigger_prediction}>
          <header className={styles.future_dates_msg}>
            For future dates, press the button below to trigger a prediction:
          </header>
          <button
            className="btn primary_btn"
            onClick={() => _handlePredictionTrigger()}
          >
            {isPredictionLoading ? <Spinner /> : `Run prediction`}
          </button>
        </div>
      ) : (
        <div className={styles.prediction_results_wrap}>
          <div className={styles.prediction_results}>
            {JSON.stringify(prediction)}
          </div>
          <button
            className="btn secondary_btn"
            onClick={() => _handleResetTrigger()}
          >
            {isPredictionLoading ? <Spinner /> : `Reset`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Predictor;
