import BaseChart from "../BaseChart";
import * as d3 from "d3";

import styles from "../../styles/BarChart.module.scss";

const drawBarChart = (props) => {
  const { svgRef, data, xScale, yScale, width, height, margin, barClass } =
    props;

  const svg = d3.select(svgRef.current).select("g");

  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", styles.bar)
    .attr("x", (d) => xScale(d.label))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value));
};

const extraProps = {
  useScaleBands: { x: true, y: false },
};

export default BaseChart(drawBarChart, extraProps);
