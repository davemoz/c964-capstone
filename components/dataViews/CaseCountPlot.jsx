import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Plot from "react-plotly.js";
import { boroughs, boroughColorsByCode } from "../../utils/boroughs";
// import styles from "../../styles/CaseCountPlot.module.scss";

const propTypes = {
  /** The data */
  data: PropTypes.array,
};

const CaseCountPlot = ({ data }) => {
  const [dates, setDates] = useState([]);
  const [mn, setMn] = useState([]);
  const [qn, setQn] = useState([]);
  const [bk, setBk] = useState([]);
  const [bx, setBx] = useState([]);
  const [si, setSi] = useState([]);
  const [boroughsData, setBoroughsData] = useState([]);

  useEffect(() => {
    data &&
      data.map((obj) => {
        Object.keys(obj).map((key) => {
          if (key === "date_of_interest") {
            setDates((prevState) => [...prevState, obj[key]]);
          } else if (key === "mn_case_count") {
            setMn((prevState) => [...prevState, obj[key]]);
          } else if (key === "qn_case_count") {
            setQn((prevState) => [...prevState, obj[key]]);
          } else if (key === "bk_case_count") {
            setBk((prevState) => [...prevState, obj[key]]);
          } else if (key === "bx_case_count") {
            setBx((prevState) => [...prevState, obj[key]]);
          } else if (key === "si_case_count") {
            setSi((prevState) => [...prevState, obj[key]]);
          }
        });
      });
  }, [data]);

  useEffect(() => {
    const allBoroughsData = {
      Bronx: bx,
      Brooklyn: bk,
      Manhattan: mn,
      Queens: qn,
      "Staten Island": si,
    };
    let boroughsDataArray = [];
    data &&
      Object.keys(allBoroughsData).map((borough, i) => {
        const boroughVal = allBoroughsData[borough];
        boroughsDataArray[i] = {
          x: dates ? dates : [],
          y: boroughVal ? boroughVal : [],
          type: "scatter",
          line: {
            width: 1,
            color: boroughColorsByCode.get(i + 1),
          },
          mode: "lines",
          name: borough,
        };
      });
    setBoroughsData(boroughsDataArray);
  }, [data, dates, bx, bk, mn, qn, si]);

  return (
    data && (
      <div className="plot_box">
        {data && (
          <Plot
            data={boroughsData}
            layout={{
              width: 1200,
              // height: 400,
              title: "Covid-19 Case Counts by Borough",
            }}
            config={
              {
                // displayModeBar: false,
                // responsive: true,
              }
            }
          />
        )}
      </div>
    )
  );
};

CaseCountPlot.propTypes = propTypes;

export default CaseCountPlot;
