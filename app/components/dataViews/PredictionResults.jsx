import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setTrainDates(dates.slice(0, dataObj.training.length));
    setTestDates(dates.slice(dataObj.training.length, dates.length));
  }, [dataObj, dates]);

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
            trainingData={dataObj.training}
            predictionsData={dataObj.predictions}
            validationData={dataObj.actual}
            predictionPoint={dataObj.prediction}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
