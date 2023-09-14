import { NYC_COVID_DATA_JSON } from "./constants";

export const getCovidData = async () => {
  const fetch_url = `${NYC_COVID_DATA_JSON}?$limit=5000`;
  const res = await fetch(fetch_url, {
    headers: {
      "X-App-Token": process.env.SOCRATA_APP_TOKEN,
    },
  });
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
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json) {
        setResultsFunc(json);
        setIsLoadingFunc(false);
        return;
      }
    }
    setAlertFunc(`There was an error fetching the data: ${res.statusText}`);
  } catch (error) {
    setIsLoadingFunc(false);
    setAlertFunc(`There was an error fetching the data: ${error}`);
  }
};
