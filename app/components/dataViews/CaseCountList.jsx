import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styles from "../../styles/CaseCountList.module.scss";

const propTypes = {
  /** The date selected by the user */
  date: PropTypes.instanceOf(Date),

  /** The last available date in the data */
  lastDataDate: PropTypes.instanceOf(Date),

  /** The data for the given date */
  data: PropTypes.object,
};

const CaseCountList = ({ date, lastDataDate, data }) => {
  const [all, setAll] = useState(null);
  const [mn, setMn] = useState(null);
  const [qn, setQn] = useState(null);
  const [bk, setBk] = useState(null);
  const [bx, setBx] = useState(null);
  const [si, setSi] = useState(null);

  useEffect(() => {
    if (data) {
      Object.keys(data).map((key) => {
        if (key === "case_count") {
          setAll(data[key]);
        } else if (key === "mn_case_count") {
          setMn(data[key]);
        } else if (key === "qn_case_count") {
          setQn(data[key]);
        } else if (key === "bk_case_count") {
          setBk(data[key]);
        } else if (key === "bx_case_count") {
          setBx(data[key]);
        } else if (key === "si_case_count") {
          setSi(data[key]);
        }
      });
    }
  }, [data]);

  return (
    <div className="lt_grey_box">
      <header>
        <h2 className="box_title">
          Case count:{" "}
          <span className="curDate">
            {date &&
              date.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </h2>
      </header>
      {data !== null ? (
        <div className="results_box">
          {data && (
            <ul className="results_list">
              <li className="results_item">Brooklyn: {bk}</li>
              <li className="results_item">Bronx: {bx}</li>
              <li className="results_item">Manhattan: {mn}</li>
              <li className="results_item">Queens: {qn}</li>
              <li className="results_item">Staten Island: {si}</li>
              <li className="results_item bold">Total: {all}</li>
            </ul>
          )}
        </div>
      ) : (
        <div className="results_box">No date selected.</div>
      )}
    </div>
  );
};

CaseCountList.propTypes = propTypes;

export default CaseCountList;
