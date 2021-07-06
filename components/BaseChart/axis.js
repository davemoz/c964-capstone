import { forwardRef, useEffect } from "react";
import * as d3 from "d3";
import classnames from "classnames";
import styles from "../../styles/BaseChart.module.scss";

function drawAxis(config) {
  const {
    margin,
    width,
    height,
    drawXAxis,
    drawYAxis,
    drawXGridlines,
    drawYGridlines,
    xLabel,
    yLabel,
    axisClass,
    gridClass,
    data,
    svgRef,
    xScale,
    yScale,
  } = config;

  const svg = d3.select(svgRef.current).select("g");

  if (drawYGridlines)
    svg
      .append("g")
      .attr("class", classnames(styles.gridlines, "gridlines__y"))
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

  if (drawXGridlines)
    svg
      .append("g")
      .attr("class", classnames(styles.gridlines, "gridlines__x"))
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

  svg
    .append("g")
    .attr("class", classnames(styles.axis, "axis__x"))
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("class", classnames(styles.axis, "axis__y"))
    .call(d3.axisLeft(yScale));

  if (xLabel)
    svg
      .append("text")
      .attr("class", classnames(styles.label, "x_label"))
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.top / 2)
      .text(xLabel);

  if (yLabel)
    svg
      .append("text")
      .attr("class", classnames(styles.label, "y_label"))
      .attr("text-anchor", "middle")
      .attr("x", -height / 2)
      .attr("y", -margin.left / 2)
      .attr("transform", "rotate(-90)")
      .text(yLabel);
}

export default drawAxis;
