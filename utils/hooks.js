import { useState, useEffect } from "react";
import { NYC_COVID_DATA_JSON, NYC_BOROUGH_BOUNDARIES_JSON } from "./constants";
import * as d3 from "d3";

export const useCovidData = () => {
  const [data, setData] = useState(undefined);

  const getData = async () => {
    if (data) {
      return data;
    }

    setData(await d3.json(NYC_COVID_DATA_JSON));
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

    setBoroughBoundaries(await d3.json(NYC_BOROUGH_BOUNDARIES_JSON));
  };
  getBoundaries();

  return boroughs;
};
