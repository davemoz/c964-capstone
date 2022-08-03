import PropTypes from "prop-types";
import Plot from "react-plotly.js";

// import styles from "../../styles/BoroughPlot.module.scss";

const propTypes = {
  /** The array of dates for the training data */
  trainDates: PropTypes.array,

  /** The array of dates for the test/predictions data */
  testDates: PropTypes.array,

  /** The date of the single prediction */
  predictDate: PropTypes.array,

  /** The read-friendly borough name */
  name: PropTypes.string,

  /** The training data set */
  trainingData: PropTypes.array,

  /** The predictions data set */
  predictionsData: PropTypes.array,

  /** The validation data set */
  validationData: PropTypes.array,

  /** The predicted single num */
  predictionPoint: PropTypes.array,
};

const BoroughPlot = ({
  trainDates,
  testDates,
  predictDate,
  name,
  trainingData,
  predictionsData,
  validationData,
  predictionPoint,
}) => {
  return (
    <div className="plot_box">
      <Plot
        data={[
          {
            x: trainDates ? trainDates : [],
            y: trainingData ? trainingData : [],
            type: "scatter",
            line: {
              width: 3,
              color: "#4a90e2",
            },
            mode: "lines",
            name: "Training",
          },
          {
            x: testDates ? testDates : [],
            y: validationData ? validationData : [],
            type: "scatter",
            line: {
              width: 3,
              color: "orangered",
            },
            mode: "lines",
            name: "Validation",
          },
          {
            x: testDates ? testDates : [],
            y: predictionsData ? predictionsData : [],
            type: "scatter",
            line: {
              width: 3,
              color: "gold",
            },
            mode: "lines",
            name: "Predicted",
          },
          {
            x: predictDate ? predictDate : "",
            y: predictionPoint
              ? predictionPoint.map((num) => Math.round(num))
              : [],
            type: "scatter",
            marker: {
              color: "green",
              size: 10,
            },
            mode: "markers",
            name: "Prediction",
            text: "Predicted case number",
            textposition: "top left",
          },
        ]}
        layout={{
          // width: 1200,
          // height: 400,
          title: `Covid-19 Case Count Prediction - <b>${name}</b>`,
          autosize: true,
        }}
        useResizeHandler={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

BoroughPlot.propTypes = propTypes;

export default BoroughPlot;
