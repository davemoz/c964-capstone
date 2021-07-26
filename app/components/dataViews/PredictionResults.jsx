import { useRef } from "react";
import dynamic from "next/dynamic";
const BoroughPlot = dynamic(() => import("./BoroughPlot"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <Loading />,
});

import styles from "../../styles/PredictionResults.module.scss";

const PredictionResults = ({ boroughKey, dataObj }) => {
  const results_box_ref = useRef();

  const _handleMoreDetailsClick = (event) => {
    if (results_box_ref.current.contains(event.currentTarget)) {
      results_box_ref.querySelectorAll("");
    }
  };

  return (
    <div className="lt_grey_box">
      <div className={`${boroughKey}-results`} ref={results_box_ref}>
        <div className={styles.results_stats}>
          Time to complete &quot;{boroughKey}&quot; prediction: {dataObj[0]}
        </div>
        <div className={styles.more_info_wrap}>
          <div className={styles.more_info_instructions}>
            For more details{" "}
            <button onClick={(event) => _handleMoreDetailsClick(event)}>
              click here
            </button>
          </div>
          <div className={styles.more_info}>
            <h2>More info</h2>
            <BoroughPlot trainingData={dataObj[1]} predictionsData={dataObj} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
