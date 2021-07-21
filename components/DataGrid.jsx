import PropTypes, { useState, useEffect, useCallback, useMemo } from "react";
import { useCovidData, useGcloudProcessedData } from "../utils/hooks";
import { boroughs } from "../utils/boroughs";
import Loading from "../components/Loading";
import Spinner from "../components/Spinner";
import CaseCountList from "./dataViews/CaseCountList";
import DeathCountList from "./dataViews/DeathCountList";
import moment from "moment";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <Loading />,
});
const CaseCountPlot = dynamic(() => import("./dataViews/CaseCountPlot"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <Loading />,
});

import styles from "../styles/DataGrid.module.scss";

const DataGrid = () => {
  const data = useCovidData();

  const [lastDataDate, setLastDataDate] = useState(new Date());
  const [userDate, setUserDate] = useState(undefined);
  const [curResult, setCurResult] = useState(null);

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

  return (
    <div className="row_wrap">
      <div className="lt_grey_box">
        <h2 className="box_title">Select a date:</h2>
        <DayPicker
          onDayClick={_handleDayClick}
          selectedDays={userDate}
          disabledDays={beforeCovid}
          todayButton="Go to today"
        />
      </div>
      <div className="lt_grey_box graph">
        <CaseCountPlot data={data} />
      </div>
      {/* <CaseCountList
        date={userDate}
        lastDataDate={lastDataDate}
        data={curResult}
      />
      <DeathCountList
        date={userDate}
        lastDataDate={lastDataDate}
        data={curResult}
      /> */}
      {
        // Checks if selected date is before lastDataDate
        // new Date(Date.parse(data.date_of_interest)).getTime() <= lastDataDate.getTime()
      }
    </div>
  );
};

export default DataGrid;
