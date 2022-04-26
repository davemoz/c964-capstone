import PropTypes from "prop-types";

import Spinner from "./Spinner";

import styles from "../styles/PredictButton.module.scss";

const propTypes = {
  /** The prediction function */
  triggerFunc: PropTypes.func,

  /** The reset function */
  resetFunc: PropTypes.func,

  /** Whether the prediction function is loading */
  predictionLoading: PropTypes.bool,

  /** Results of the prediction function */
  predictionResults: PropTypes.object,
};

const PredictButton = ({
  triggerFunc,
  resetFunc,
  predictionLoading,
  predictionResults,
}) => {
  return !predictionResults ? (
    <div className={styles.trigger_prediction}>
      <button
        className="btn primary_btn"
        onClick={() => triggerFunc()}
        disabled={predictionLoading ? true : false}
      >
        {predictionLoading ? <Spinner /> : "Generate prediction"}
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

export default PredictButton;
