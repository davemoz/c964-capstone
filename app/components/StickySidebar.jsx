import { useState } from "react";
import { useFetch } from "../utils/hooks";
import { GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT } from "../utils/constants";
import PredictButton from "./PredictButton";
import CaseCountList from "./dataViews/CaseCountList";

import styles from "../styles/StickySidebar.module.scss";

const StickySidebar = ({
  data,
  lastDataDate,
  predictDate,
  triggerFunc,
  resetFunc,
  predictionLoading,
  setPredictionLoadingFunc,
  predictionResults,
  setPredictionResultsFunc,
}) => {
  const [alertText, setAlertText] = useState(null);

  const _handleTrigger = () => {
    return useFetch(
      GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT,
      setPredictionLoadingFunc,
      setPredictionResultsFunc,
      setAlertText
    );
  };

  const _handleReset = () => {
    setPredictionResultsFunc(null);
  };

  return (
    <div className="sticky_wrap">
      <div className="absolute_wrap">
        <div className="lt_grey_box">
          <h2 className="box_title">Generate prediction:</h2>
          <p className="box_sub">
            Data is available up to{" "}
            {lastDataDate && lastDataDate.format("MMMM D, YYYY")}.
          </p>
          <p className="box_sub">
            Click the button below to generate a case number prediction for the
            next day: <b>{predictDate && predictDate.format("MMMM D, YYYY")}</b>
          </p>
          {alertText && <div className={styles.alert_text}>{alertText}</div>}
          <PredictButton
            triggerFunc={_handleTrigger}
            resetFunc={_handleReset}
            predictionLoading={predictionLoading}
            predictionResults={predictionResults}
          />
        </div>
        {predictionResults && (
          <div className="lt_grey_box">
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
