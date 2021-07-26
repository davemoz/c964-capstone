import PropTypes, { useState, useEffect, useCallback } from "react";
import { useCovidData, useGcloudProcessedData } from "../utils/hooks";
import { GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT } from "../utils/constants";
import { boroughs } from "../utils/boroughs";
import Loading from "../components/Loading";
import DatePicker from "./DatePicker";
import CaseCountList from "./dataViews/CaseCountList";
import DeathCountList from "./dataViews/DeathCountList";
import Predictor from "./Predictor";
import PredictionResults from "./dataViews/PredictionResults";
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

  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);

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

  const _handleTrigger = (args) => {
    const fetchProcessedData = async () => {
      setIsPredictionLoading(true);
      if (predictionResults) {
        setIsPredictionLoading(false);
        return predictionResults;
      }

      let args_string = args ? "?" : "";
      args &&
        Object.keys(args).map((key, idx) => {
          idx === Object.keys(args).length - 1
            ? (args_string += `${key}=${args[key]}`)
            : (args_string += `${key}=${args[key]}&`);
        });

      try {
        const data = await fetch(
          GCLOUD_PROCESS_COVID_FUNCTION_ENDPOINT + `${args_string}`
        )
          .then((response) => response.json())
          .then((resData) => {
            return resData;
          });
        setPredictionResults(data);
        setIsPredictionLoading(false);
      } catch (error) {
        setIsPredictionLoading(false);
        throw new Error(`There was an error fetching the data: ${error}`);
      }
    };
    fetchProcessedData();
  };

  const _handleReset = () => {
    setPredictionResults(null);
  };

  return (
    <>
      <div className="row_wrap">
        <div className="lt_grey_box">
          <h2 className="box_title">Select a date:</h2>
          <DatePicker dayClickFunc={_handleDayClick} currentDate={userDate} />
          <Predictor
            currentDate={userDate}
            triggerFunc={_handleTrigger}
            resetFunc={_handleReset}
            predictionLoading={isPredictionLoading}
            predictionResults={predictionResults}
          />
        </div>
        {predictionResults ? (
          <>
            {Object.keys(predictionResults).map((borough) => {
              const boroughObj = predictionResults[borough];
              return (
                <PredictionResults
                  key={borough}
                  boroughKey={borough}
                  dataObj={boroughObj}
                />
              );
            })}
          </>
        ) : (
          <div className="lt_grey_box">No results</div>
        )}
      </div>
      <div className="row_wrap">
        <div className="lt_grey_box graph">
          {/* <CaseCountPlot data={data} /> */}
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
    </>
  );
};

export default DataGrid;
