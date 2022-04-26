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

  return boroughs;
};

export const useFetch = async (
  endpoint,
  setIsLoadingFunc,
  setResultsFunc,
  setAlertFunc,
  results
) => {
  if (results) {
    setIsLoadingFunc(false);
    return results;
  }
  setIsLoadingFunc(true);
  try {
    const data = await fetch(endpoint)
      .then((response) => response.json())
      .then((resData) => {
        return resData;
      });
    setResultsFunc(data);
    setIsLoadingFunc(false);
  } catch (error) {
    setIsLoadingFunc(false);
    setAlertFunc(`There was an error fetching the data: ${error}`);
  }
};
