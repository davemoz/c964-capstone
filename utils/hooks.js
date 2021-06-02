import { NYC_COVID_DATA_JSON, NYC_BOROUGH_BOUNDARIES_JSON } from "./constants";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useCovidData() {
  const { data, error } = useSWR(NYC_COVID_DATA_JSON, fetcher);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useBoroughs() {
  const { data, error } = useSWR(NYC_BOROUGH_BOUNDARIES_JSON, fetcher);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
