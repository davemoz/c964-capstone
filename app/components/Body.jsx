import PropTypes, { useState, useEffect } from "react";
import { useCovidData } from "../utils/hooks";
import { boroughs } from "../utils/boroughs";
import moment from "moment";
import Loading from "./Loading";
import StickySidebar from "./StickySidebar";
import PredictionResults from "./dataViews/PredictionResults";

import styles from "../styles/Body.module.scss";

const Body = () => {
  const data = useCovidData();

  const [dates, setDates] = useState(null);
  const [lastDataDate, setLastDataDate] = useState(null);
  const [predictDate, setPredictDate] = useState(null);
  const [curResult, setCurResult] = useState(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);

  useEffect(() => {
    let datesArray = [];
    data &&
      data.map((day) => {
        datesArray.push(day["date_of_interest"]);
      });
    setDates(datesArray);
  }, [data]);

  useEffect(() => {
    if (dates !== null) {
      setLastDataDate(moment(dates[dates.length - 1]));
      setPredictDate(moment(dates[dates.length - 1]).add(1, "days"));
    }
  }, [dates]);

  return (
    <>
      <StickySidebar
        data={data}
        lastDataDate={lastDataDate}
        predictDate={predictDate}
        predictionLoading={isPredictionLoading}
        setPredictionLoadingFunc={setIsPredictionLoading}
        predictionResults={predictionResults}
        setPredictionResultsFunc={setPredictionResults}
      />
      {predictionResults && (
        <>
          {Object.keys(predictionResults).map((borough) => {
            const boroughObj = predictionResults[borough];
            return (
              <PredictionResults
                key={borough}
                boroughKey={borough}
                dataObj={boroughObj}
                dates={dates}
                predictDate={
                  new Array(
                    predictDate.startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS")
                  )
                }
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default Body;
