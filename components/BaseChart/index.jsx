import { createRef, useEffect } from "react";
import * as d3 from "d3";
import drawAxis from "./axis";
import drawTooltip from "./tooltip";

import styles from "../../styles/BaseChart.module.scss";

const BaseChart = (drawChart, extraProps) => {
  const Chart = (props) => {
    const {
      axisProps,
      data,
      svgProps,
      tooltipClass,
      scaleBandPadding,
      ...restProps
    } = props;

    const svgRef = createRef();
    const tooltipRef = createRef();

    const { useScaleBands, findHoverData } = extraProps;

    const { margin, width, height } = svgProps;

    const xMaxValue = (data) => d3.max(data, (d) => d[0]);
    const yMaxValue = (data) => d3.max(data, (d) => d[1]);

    let xScale = (props) => {
      return d3.scaleLinear().domain([0, xMaxValue]).range([0, width]);
    };

    if (useScaleBands.x) {
      xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d[0]))
        .padding(scaleBandPadding);
    }

    let yScale = (props) => {
      return d3.scaleLinear().domain([0, yMaxValue]).range([height, 0]);
    };

    if (useScaleBands.y) {
      yScale = d3
        .scaleBand()
        .range([height, 0])
        .domain(data.map((d) => d[1]))
        .padding(scaleBandPadding);
    }

    useEffect(() => {
      flushChart();
      draw();
    });

    function flushChart() {
      d3.select(svgRef.current).selectAll("*").remove();
    }

    function draw() {
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      drawAxis({
        ...axisProps,
        ...svgProps,
        ...extraProps,
        data,
        svgRef,
        xScale,
        yScale,
      });

      drawChart({
        svgRef,
        data,
        xScale,
        yScale,
        ...svgProps,
        ...restProps,
      });

      drawTooltip({
        useScaleBands,
        svgRef,
        tooltipRef,
        data,
        xScale,
        yScale,
        findHoverData,
        ...svgProps,
        ...restProps,
      });
    }

    return (
      <div className={styles.container}>
        <svg ref={svgRef} className={styles.svg_container} />
        <div className={styles.tooltip} ref={tooltipRef} />
      </div>
    );
  };

  Chart.defaultProps = {
    scaleBandPadding: 0.05,
    svgProps: {
      margin: 10,
    },
  };

  return Chart;
};
export default BaseChart;
