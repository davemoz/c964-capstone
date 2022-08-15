import React, { useState, useEffect } from "react";
import { useCovidData } from "../utils/hooks";
import moment from "moment";
import StickySidebar from "./StickySidebar";
import PredictionResults from "./dataViews/PredictionResults";

const Body = () => {
  const json = useCovidData();

  const [dates, setDates] = useState(null);
  const [lastDataDate, setLastDataDate] = useState(null);
  const [predictDate, setPredictDate] = useState(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState([]);

  useEffect(() => {
    let datesArray = [];
    json &&
      json.map((day) => {
        datesArray.push(day["date_of_interest"]);
      });
    setDates(datesArray);
  }, [json]);

  useEffect(() => {
    if (!!dates) {
      setLastDataDate(moment(dates[dates.length - 1]));
      setPredictDate(moment(dates[dates.length - 1]).add(1, "days"));
    }
  }, [dates]);

  return (
    <>
      <StickySidebar
        lastDataDate={lastDataDate}
        predictDate={predictDate}
        predictionLoading={isPredictionLoading}
        setPredictionLoadingFunc={setIsPredictionLoading}
        predictionResults={predictionResults}
        setPredictionResultsFunc={setPredictionResults}
      />
      {predictionResults.length > 0 && (
        <>
          {predictionResults.map((boroughObj) => {
            const key = Object.keys(boroughObj)[0];
            return (
              <PredictionResults
                key={key}
                boroughKey={key}
                dataObj={boroughObj}
                dates={dates}
                predictDate={
                  predictDate && Array.of(
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
