import { useState } from "react";
import { NYC_COVID_DATA_JSON, NYC_BOROUGH_BOUNDARIES_JSON } from "./constants";
import { json } from "d3-fetch";

export const useCovidData = () => {
  const [data, setData] = useState(undefined);

  const getData = async () => {
    if (data) {
      return data;
    }

    setData(await json(NYC_COVID_DATA_JSON));
  };
  getData();

  return data;
};

export const useBoroughBoundaries = () => {
  const [boroughBoundaries, setBoroughBoundaries] = useState(undefined);

  const getBoundaries = async () => {
    if (boroughBoundaries) {
      return boroughBoundaries;
    }

    setBoroughBoundaries(await json(NYC_BOROUGH_BOUNDARIES_JSON));
  };
  getBoundaries();

  return boroughBoundaries;
};

export const useFetch = async (
  endpoint,
  boroughKey,
  setIsLoadingFunc,
  setResultsFunc,
  setAlertFunc,
  results
) => {
  setIsLoadingFunc(true);

  // Check if we already retrieved the borough data
  if (results && Object.keys(results).includes(boroughKey)) {
    setIsLoadingFunc(false);
    return results;
  }

  // Check that borough is selected for new fetch
  if (boroughKey === "default") {
    setIsLoadingFunc(false);
    setAlertFunc("Please choose a borough before submitting.");
    return;
  }

  // Fetch borough data
  const url = new URL(endpoint);
  url.searchParams.append("borough", boroughKey);
  try {
    const data = await fetch(url)
      .then((response) => response.json())
      .then((resData) => {
        return resData;
      });
    setResultsFunc((prevValue) =>
      prevValue.map((obj, idx) =>
        Object.keys(obj)[0] === Object.keys(data)[0]
          ? (prevValue[idx] = data)
          : prevValue.append(data)
      )
    );
    setIsLoadingFunc(false);
  } catch (error) {
    setIsLoadingFunc(false);
    setAlertFunc(`There was a client error fetching the data: ${error}`);
  }
};
