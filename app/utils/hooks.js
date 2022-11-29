import { NYC_COVID_DATA_JSON } from "./constants";

export const getCovidData = async () => {
  const res = await fetch(NYC_COVID_DATA_JSON);
  if (!res.ok) {
    throw new Error(`There was an error fetching the data: ${res.statusText}`);
  }
  const json = await res.json();
  const extractedDatesArr = json?.map((item) => item.date_of_interest);
  return extractedDatesArr;
};

export const useFetch = async (
  endpoint,
  setIsLoadingFunc,
  setResultsFunc,
  setAlertFunc,
  results
) => {
  setIsLoadingFunc(true);

  // Check if we already retrieved the borough data
  if (results) {
    setIsLoadingFunc(false);
    return results;
  }

  // Fetch borough data
  const url = new URL(endpoint);
  try {
    const data = await fetch(url)
      .then((response) => response.json())
      .then((resData) => resData);
    setResultsFunc(data);
    setIsLoadingFunc(false);
  } catch (error) {
    setIsLoadingFunc(false);
    setAlertFunc(`There was a client error fetching the data: ${error}`);
  }
};
