import React, { useState, useEffect } from "react";
import { boroughs } from "../../utils/boroughs";
import PropTypes from "prop-types";

import styles from "../../styles/CaseCountList.module.scss";

const propTypes = {
  /** The date of the prediction */
  predictDate: PropTypes.object,

  /** The prediction data */
  predictionResults: PropTypes.object,
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
            {Object.keys(boroughs).map((borough) => {
              const name = borough;
              const key = boroughs[borough];
              return (
                <li
                  key={key}
                  className={`${styles.results_item} ${Math.round(predictionResults[key].prediction) ===
                    highestCount
                    ? "highest"
                    : ""
                    }`}
                >
                  {name}: {Math.round(predictionResults[key].prediction)}
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
