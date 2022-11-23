import React, { useState, useEffect } from "react";
import moment from "moment";
import StickySidebar from "./StickySidebar";
import PredictionResults from "./dataViews/PredictionResults";

const Body = ({ covidDates }) => {
  const [lastDataDate, setLastDataDate] = useState(moment());
  const [predictDate, setPredictDate] = useState(moment());
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState([]);

  useEffect(() => {
    if (covidDates?.length > 0) {
      setLastDataDate(moment(covidDates[covidDates.length - 1]));
      setPredictDate(moment(covidDates[covidDates.length - 1]).add(1, "days"));
    }
  }, [covidDates]);

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
                dates={covidDates}
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
