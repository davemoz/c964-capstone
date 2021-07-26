import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Spinner from "./Spinner";

import styles from "../styles/Predictor.module.scss";

const propTypes = {
  /** The user-selected date */
  currentDate: PropTypes.object,

  /** The prediction function */
  triggerFunc: PropTypes.func,

  /** The reset function */
  resetFunc: PropTypes.func,

  /** Whether the prediction function is loading */
  predictionLoading: PropTypes.bool,

  /** Results of the prediction function */
  predictionResults: PropTypes.object,
};

const Predictor = ({
  currentDate,
  triggerFunc,
  resetFunc,
  predictionLoading,
  predictionResults,
}) => {
  const formattedDate = currentDate
    ? new Date(currentDate).toLocaleString("en-US", {
        // weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return !predictionResults ? (
    <div className={styles.trigger_prediction}>
      <button
        className="btn primary_btn"
        onClick={() => triggerFunc(currentDate)}
      >
        {predictionLoading ? (
          <Spinner />
        ) : (
          `Generate prediction${formattedDate ? " for " + formattedDate : ""}`
        )}
      </button>
      <p className={styles.disclaimer}>(may take up to 2 minutes)</p>
    </div>
  ) : (
    <div className={styles.prediction_results_wrap}>
      <button className="btn secondary_btn" onClick={() => resetFunc()}>
        {predictionLoading ? <Spinner /> : `Reset`}
      </button>
    </div>
  );
};

export default Predictor;
