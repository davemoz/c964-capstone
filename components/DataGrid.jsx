import PropTypes, { Suspense } from "react";
import { useCovidData } from "../utils/hooks";

const propTypes = {
  // Additional class names
  addlClassNames: PropTypes.string,
};

const DataGrid = ({ addlClassNames }) => {
  const { data, isLoading, isError } = useCovidData();
  if (isError)
    return <div className={`${addlClassNames} error`}>Failed to load.</div>;
  if (isLoading)
    return <div className={`${addlClassNames} loading`}>Loading...</div>;

  // render data
  return <div className={addlClassNames}>{JSON.stringify(data)}</div>;
};

export default DataGrid;
