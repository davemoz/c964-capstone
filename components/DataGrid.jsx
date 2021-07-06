import PropTypes, { useState, useEffect, useCallback, useMemo } from "react";
import { useCovidData } from "../utils/hooks";
import { boroughs } from "../utils/boroughs";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import moment from "moment";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

import styles from "../styles/DataGrid.module.scss";

const DataGrid = () => {
  const data = useCovidData();
  const [allData, setAllData] = useState({});
  const [bkData, setBkData] = useState({});
  const [bxData, setBxData] = useState({});
  const [mnData, setMnData] = useState({});
  const [qnData, setQnData] = useState({});
  const [siData, setSiData] = useState({});

  const [lastDataDate, setLastDataDate] = useState(new Date());

  const [borough, setBorough] = useState(null);
  const [date, setDate] = useState(undefined);

  const [curResult, setCurResult] = useState(null);

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
      setDate(undefined);
      return;
    }
    const adjustedDay = day;
    adjustedDay.setHours(0);
    setDate(adjustedDay);
  };

  const _handleBoroughSelect = (e) => {
    setBorough(e.target.value);
  };

  const _handleClearBorough = () => {
    setBorough(null);
  };

  const findByDate = useCallback(
    (date) => {
      return data.filter((day) => {
        const dateObj = new Date(Date.parse(day.date_of_interest));
        return dateObj.getTime() === date.getTime();
      });
    },
    [data]
  );

  useEffect(() => {
    data && setLastDataDate(new Date(data[data.length - 1].date_of_interest));
  }, [data]);

  useEffect(() => {
    if (date) {
      const foundDate = findByDate(date);
      foundDate.length === 0 ? setCurResult(date) : setCurResult(foundDate[0]);
    } else {
      setCurResult(null);
    }
  }, [date, findByDate]);

  // useEffect(() => {
  // 	borough ?
  // 		data.map((day) => {
  // 			day.date_of_interest === date ? setCurResult(day) : setCurResult(null);
  // 		})
  // }, [data, borough]);

  return (
    <>
      <div className={styles.user_select}>
        {/* <LineChart data={getCases7DayAvg("all")} width={400} height={300} /> */}
        {/* <BarChart data={data} width={600} height={500} /> */}

        <div className={styles.date_picker}>
          <p>Select a date to view COVID-19 data for that day:</p>
          <DayPicker
            onDayClick={_handleDayClick}
            selectedDays={date}
            disabledDays={beforeCovid}
            todayButton="Go to today"
          />
        </div>

        <div className={styles.borough_picker}>
          <p>Select a borough to filter the COVID-19 data:</p>
          <select
            className={styles.borough_select}
            onChange={_handleBoroughSelect}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a borough...
            </option>
            {Object.keys(boroughs).map((borough) => {
              return (
                <option key={boroughs[borough]} value={boroughs[borough]}>
                  {borough}
                </option>
              );
            })}
          </select>
          <button className="clear_borough" onClick={_handleClearBorough}>
            Clear
          </button>
        </div>
        <div className={styles.user_select_result}>
          {curResult !== null ? (
            new Date(Date.parse(curResult.date_of_interest)).getTime() <=
            lastDataDate.getTime() ? (
              <div>
                {new Date(curResult.date_of_interest).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            ) : (
              <div>
                <div>
                  For future dates, press the button below to trigger a
                  prediction:
                </div>
                <button>Trigger</button>
              </div>
            )
          ) : (
            "No date selected."
          )}
        </div>
      </div>
      <div>{/* <Map /> */}</div>
    </>
  );
};

export default DataGrid;
