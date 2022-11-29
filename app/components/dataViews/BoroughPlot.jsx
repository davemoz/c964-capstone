import React from "react";
import PropTypes from "prop-types";
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  ScatterController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  ScatterController,
);

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
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `Covid-19 Case Count Prediction - ${name}`
      }
    }
  };

  const labels = [...trainDates, ...testDates, ...predictDate].map(date => dayjs(date).format('MMM D \'YY'));

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Training',
        data: trainingData.map((row, idx) => ({
          x: dayjs(trainDates[idx]).format('MMM D \'YY'),
          y: row
        })),
        borderColor: '#4a90e2',
        pointRadius: 0,
        order: 4
      },
      {
        type: 'line',
        label: 'Validation',
        data: validationData.map((row, idx) => ({
          x: dayjs(testDates[idx]).format('MMM D \'YY'),
          y: row
        })),
        borderColor: 'orangered',
        pointRadius: 0,
        order: 3
      },
      {
        type: 'line',
        label: 'Predicted',
        data: predictionsData.map((row, idx) => ({
          x: dayjs(testDates[idx]).format('MMM D \'YY'),
          y: row
        })),
        borderColor: 'gold',
        pointRadius: 0,
        order: 2
      },
      {
        type: 'scatter',
        label: 'Prediction',
        data: [
          {
            x: dayjs(predictDate).format('MMM D \'YY'),
            y: Math.round(predictionPoint)
          }
        ],
        borderColor: 'green',
        backgroundColor: 'green',
        order: 1
      }
    ]
  }

  return (
    <div className="plot_box">
      <Chart type="line" options={options} data={data} />
    </div>
  );
};

BoroughPlot.propTypes = propTypes;

export default BoroughPlot;
