import { useState, useEffect } from "react";
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
