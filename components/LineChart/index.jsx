import PropTypes from "prop-types";
import BaseChart from "../BaseChart";
import * as d3 from "d3";

import styles from "../../styles/LineChart.module.scss";

const propTypes = {
  /** The data */
  data: PropTypes.array,
};

const LineChart = (props) => {
  function drawLineChart(props) {
    const {
      svgRef,
      data,
      xScale,
      yScale,
      width,
      height,
      margin,
      lineClass,
      strokeWidth,
    } = props;

    const svg = d3.select(svgRef.current).select("g");

    const line = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke-width", strokeWidth)
      .attr("class", "line")
      .attr("d", line)
      .attr("class", styles.path);
  }

  const extraProps = {
    useScaleBands: { x: true, y: false },
  };

  return <LineChart>{BaseChart(drawLineChart, extraProps)}</LineChart>;
};

LineChart.propTypes = propTypes;

export default LineChart;
