import React, { useState } from "react";
import { boroughs } from "../utils/boroughs";
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
  const [selectedBorough, setSelectedBorough] = useState("default");

  const _handleSubmit = () => {
    return useFetch(
      GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT,
      // selectedBorough,
      setPredictionLoadingFunc,
      setPredictionResultsFunc,
      setAlertText
    );
  };

  const _handleReset = () => {
    setPredictionResultsFunc(null);
    setAlertText(null);
    setSelectedBorough("default");
  };

  const _handleSelectChange = (event) => {
    event.preventDefault();
    setAlertText(null);
    setSelectedBorough(event.target.value);
  }

  const _handleSelectBlur = (event) => {
    event.preventDefault();
    if (selectedBorough === 'default') {
      return setAlertText('Please choose a borough before submitting.');
    }
    setSelectedBorough(event.target.value);
  }

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
          {/* <select className={styles.borough_select} value={selectedBorough} onBlur={_handleSelectBlur} onChange={_handleSelectChange}>
            <option disabled={true} hidden={true} value="default">Select a borough...</option>
            {Object.keys(boroughs).map(borough => <option key={borough} value={boroughs[borough]}>{borough}</option>)}
          </select> */}
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
