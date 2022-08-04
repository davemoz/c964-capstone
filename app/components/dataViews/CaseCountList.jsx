import React, { useState, useEffect } from "react";
import { boroughs } from "../../utils/boroughs";
import PropTypes from "prop-types";

import styles from "../../styles/CaseCountList.module.scss";

const propTypes = {
  /** The date of the prediction */
  predictDate: PropTypes.object,

  /** Array of borough prediction data objects */
  predictionResults: PropTypes.array,
};

const CaseCountList = ({ predictDate, predictionResults }) => {
  const [highestCount, setHighestCount] = useState(0);

  useEffect(() => {
    predictionResults &&
      setHighestCount(
        Math.max.apply(
          Math,
          Object.keys(predictionResults).map((key) => {
            return Math.round(predictionResults[key].prediction);
          })
        )
      );
  }, [predictionResults]);

  return (
    <>
      <header>
        <h2 className={styles.box_title}>
          Predicted case counts:{" "}
          <span className={styles.curDate}>
            {predictDate && predictDate.format("MMMM D, YYYY")}
          </span>
        </h2>
        <p className={styles.box_sub}>Highest predicted count is bold.</p>
      </header>
      {predictionResults && (
        <div className={styles.results_box}>
          <ul className={styles.results_list}>
            {predictionResults.map(boroughResult => {
              const key = Object.keys(boroughResult)[0];
              const name = Object.keys(boroughs).find(boroughName => boroughs[boroughName] === key);
              const num = predictionResults ? Math.round(predictionResults[key].prediction) : null;
              return (
                <li
                  key={key}
                  className={`${styles.results_item} ${num === highestCount ? "highest" : ""}`}
                >
                  {name}: {num}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

CaseCountList.propTypes = propTypes;

export default CaseCountList;
