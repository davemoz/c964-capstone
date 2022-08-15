import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { boroughs } from "../../utils/boroughs";
import Loading from "../Loading";
import dynamic from "next/dynamic";
const BoroughPlot = dynamic(() => import("./BoroughPlot"), {
  ssr: false,
  loading: () => <Loading />,
});

import styles from "../../styles/PredictionResults.module.scss";

const propTypes = {
  /** The key of the borough */
  boroughKey: PropTypes.string,

  /** The object of data for the borough */
  dataObj: PropTypes.object,

  /** Array of all available dates */
  dates: PropTypes.array,

  /** Array containing the date string of the predicted case number */
  predictDate: PropTypes.array,
};

const PredictionResults = ({ boroughKey, dataObj, dates, predictDate }) => {
  const [trainDates, setTrainDates] = useState([]);
  const [testDates, setTestDates] = useState([]);
  const boroughObj = dataObj && dataObj[boroughKey];

  useEffect(() => {
    setTrainDates(dates.slice(0, boroughObj.training.length));
    setTestDates(dates.slice(boroughObj.training.length, dates.length));
  }, [boroughObj, dates]);

  const name = Object.keys(boroughs).find(
    (key) => boroughs[key] === boroughKey
  );

  return (
    <div className={styles.row_wrap}>
      <div className={`${styles.lt_grey_box} ${styles.graph}`}>
        <div className={styles.results_graph}>
          <BoroughPlot
            trainDates={trainDates}
            testDates={testDates}
            predictDate={predictDate}
            name={name}
            trainingData={boroughObj.training}
            predictionsData={boroughObj.predictions}
            validationData={boroughObj.actual}
            predictionPoint={boroughObj.prediction}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
