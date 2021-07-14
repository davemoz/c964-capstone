import PropTypes, { useState, useEffect, useCallback, useMemo } from "react";
import { GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT } from "../utils/constants";
import { useCovidData, useGcloudProcessedData } from "../utils/hooks";
import { boroughs } from "../utils/boroughs";
import Loading from "../components/Loading";
import Spinner from "../components/Spinner";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import moment from "moment";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

import styles from "../styles/DataGrid.module.scss";

const DataGrid = () => {
  const data = useCovidData();
  const [all, setAll] = useState(null);
  const [mn, setMn] = useState(null);
  const [qn, setQn] = useState(null);
  const [bk, setBk] = useState(null);
  const [bx, setBx] = useState(null);
  const [si, setSi] = useState(null);

  const [lastDataDate, setLastDataDate] = useState(new Date());

  const [borough, setBorough] = useState(null);
  const [userDate, setUserDate] = useState(undefined);

  const [curResult, setCurResult] = useState(null);

  const [prediction, setPrediction] = useState(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);

  const getCases7DayAvg = useCallback(
    (prefix) => {
      const modifiedPref = prefix + "_";
      const cases7Avg = [];
      data.map((day, i) => {
        cases7Avg.push([i, day[`${modifiedPref}case_count_7day_avg`]]);
      });
      return cases7Avg;
    },
    [data]
  );

  const beforeCovid = {
    // February, 29, 2020
    before: new Date(2020, 1, 29),
  };

  const _handleDayClick = (day, { selected, disabled }) => {
    if (disabled) {
      // Day is disabled, do nothing
      return;
    }
    if (selected) {
      // Unselect the day if already selected
      setUserDate(undefined);
      return;
    }
    const adjustedDay = day;
    adjustedDay.setHours(0);
    setUserDate(adjustedDay);
  };

  // const _handleBoroughSelect = (e) => {
  //   setBorough(e.target.value);
  // };

  // const _handleClearBorough = () => {
  //   setBorough(null);
  // };

  const _handlePredictionTrigger = (args) => {
    const fetchProcessedData = async () => {
      setIsPredictionLoading(true);
      if (prediction) {
        setIsPredictionLoading(false);
        return prediction;
      }

      let args_string = "?";
      args &&
        Object.keys(args).map((key, idx) => {
          idx === Object.keys(args).length - 1
            ? (args_string += `${key}=${args[key]}`)
            : (args_string += `${key}=${args[key]}&`);
        });

      try {
        const res = await fetch(
          GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT + `${args_string}`
        );
        const data = res.json();
      } catch (error) {
        setIsPredictionLoading(false);
        throw new Error(`There was an error fetching the data: ${error}`);
      }

      setPrediction(data);
      setIsPredictionLoading(false);
    };
    fetchProcessedData();
  };

  const findByDate = useCallback(
    (userDate) => {
      return data.filter((day) => {
        const dateObj = new Date(Date.parse(day.date_of_interest));
        return dateObj.getTime() === userDate.getTime();
      });
    },
    [data]
  );

  useEffect(() => {
    data && setLastDataDate(new Date(data[data.length - 1].date_of_interest));
  }, [data]);

  useEffect(() => {
    if (userDate) {
      const foundDate = findByDate(userDate);
      foundDate.length === 0
        ? setCurResult(userDate)
        : setCurResult(foundDate[0]);
    } else {
      setCurResult(null);
    }
  }, [userDate, findByDate]);

  useEffect(() => {
    if (curResult) {
      Object.keys(curResult).map((key) => {
        switch (key) {
          case "all_case_count_7day_avg":
            setAll(curResult[key]);
          case "mn_case_count_7day_avg":
            setMn(curResult[key]);
          case "qn_case_count_7day_avg":
            setQn(curResult[key]);
          case "bk_case_count_7day_avg":
            setBk(curResult[key]);
          case "bx_case_count_7day_avg":
            setBx(curResult[key]);
          case "si_case_count_7day_avg":
            setSi(curResult[key]);
        }
      });
    }
  }, [curResult]);

  // useEffect(() => {
  // 	borough ?
  // 		data.map((day) => {
  // 			day.date_of_interest === userDate ? setCurResult(day) : setCurResult(null);
  // 		})
  // }, [data, borough]);

  return (
    <>
      <div className={styles.user_select}>
        {/* <LineChart data={getCases7DayAvg("all")} width={400} height={300} /> */}
        {/* <BarChart data={data} width={600} height={500} /> */}

        <div className={styles.date_picker}>
          <h2 className={styles.box_title}>Select a date:</h2>
          <DayPicker
            onDayClick={_handleDayClick}
            selectedDays={userDate}
            disabledDays={beforeCovid}
            todayButton="Go to today"
          />
        </div>
        <div className={styles.user_select_result}>
          <div>
            <header>
              <h2 className={styles.box_title}>
                Case count:{" "}
                <span className={styles.curDate}>
                  {userDate &&
                    userDate.toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </span>
              </h2>
              <sub className={styles.box_subtitle}>7-day average</sub>
            </header>
            {curResult !== null ? (
              new Date(Date.parse(curResult.date_of_interest)).getTime() <=
              lastDataDate.getTime() ? (
                <div className={styles.results_box}>
                  {curResult && (
                    <ul className={styles.results_list}>
                      <li className={styles.results_item}>All: {all}</li>
                      <li className={styles.results_item}>Brooklyn: {bk}</li>
                      <li className={styles.results_item}>Bronx: {bx}</li>
                      <li className={styles.results_item}>Manhattan: {mn}</li>
                      <li className={styles.results_item}>Queens: {qn}</li>
                      <li className={styles.results_item}>
                        Staten Island: {si}
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <div className={styles.results_box}>
                  {prediction && (
                    <div className={styles.trigger_prediction}>
                      <p className={styles.future_dates_msg}>
                        For future dates, press the button below to trigger a
                        prediction:
                      </p>
                      <button
                        className={styles.trigger_btn}
                        onClick={() =>
                          _handlePredictionTrigger({ date: userDate })
                        }
                      >
                        {isPredictionLoading ? <Spinner /> : `Run prediction`}
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className={styles.results_box}>No date selected.</div>
            )}
          </div>
        </div>
      </div>
      {prediction && (
        <div className={styles.prediction_box}>
          {JSON.stringify(prediction)}
        </div>
      )}
      {/* <Map /> */}
    </>
  );
};

export default DataGrid;
