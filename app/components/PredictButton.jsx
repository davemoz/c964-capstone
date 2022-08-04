import React from 'react';
import PropTypes from "prop-types";

import Spinner from "./Spinner";

import styles from "../styles/PredictButton.module.scss";

const propTypes = {
  /** Function for submitting a request to the prediction server */
  submitFunc: PropTypes.func,

  /** The reset function */
  resetFunc: PropTypes.func,

  /** Whether the prediction function is loading */
  predictionLoading: PropTypes.bool,

  /** Results of the prediction function */
  predictionResults: PropTypes.object,
};

const PredictButton = ({
  submitFunc,
  resetFunc,
  predictionLoading,
  predictionResults,
}) => {
  return predictionResults.length > 0 ? (
    <div className={styles.prediction_results_wrap}>
      <button className={`${styles.btn} ${styles.secondary_btn}`} onClick={() => resetFunc()}>
        {predictionLoading ? <Spinner /> : 'Reset'}
      </button>
    </div>
  ) : (
    <div className={styles.trigger_prediction}>
      <button
        className={`${styles.btn} ${styles.primary_btn}`}
        onClick={() => submitFunc()}
        disabled={predictionLoading ? true : false}
      >
        {predictionLoading ? <Spinner /> : 'Generate prediction'}
      </button>
      <p className={styles.disclaimer}>(may take up to 2 minutes)</p>
    </div>
  );
};

export default PredictButton;
