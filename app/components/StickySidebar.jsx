import React, { useState, useCallback } from "react";
import { GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT } from "../utils/constants";
import { useFetch } from "../utils/hooks";
import PredictButton from "./PredictButton";
import CaseCountList from "./dataViews/CaseCountList";

import styles from "../styles/StickySidebar.module.scss";

const StickySidebar = ({
  lastDataDate,
  predictDate,
  predictionLoading,
  setPredictionLoadingFunc,
  predictionResults,
  setPredictionResultsFunc,
}) => {
  const [alertText, setAlertText] = useState(null);

  const { doFetch } = useFetch(
    GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT,
    setPredictionLoadingFunc,
    setPredictionResultsFunc,
    setAlertText,
    predictionResults
  );

  const _handleSubmit = useCallback(() => {
    doFetch();
  }, [doFetch]);

  const _handleReset = useCallback(() => {
    setPredictionResultsFunc([]);
    setAlertText(null);
  }, [setPredictionResultsFunc, setAlertText]);

  return (
    <div className={styles.sticky_wrap}>
      <div className={styles.absolute_wrap}>
        <div className={styles.lt_grey_box}>
          <h2 className={styles.box_title}>Generate prediction:</h2>
          <p className={styles.box_sub}>
            Data is complete and available up to{" "}
            {lastDataDate && lastDataDate.format("MMMM D, YYYY")}.
          </p>
          <p className={styles.box_sub}>
            Click the button to generate a case number prediction for the next day: <b>{predictDate && predictDate.format("MMMM D, YYYY")}</b>
          </p>
          <PredictButton
            submitFunc={_handleSubmit}
            resetFunc={_handleReset}
            predictionLoading={predictionLoading}
            predictionResults={predictionResults}
          />
          {alertText && <div className={styles.alert_text}>{alertText}</div>}
        </div>
        {predictionResults.length > 0 && (
          <div className={styles.lt_grey_box}>
            <CaseCountList
              predictDate={predictDate}
              predictionResults={predictionResults}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StickySidebar;
