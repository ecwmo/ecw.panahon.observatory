import { computed } from "vue";
import * as d3 from "d3";

import forecastVars from "@/data/forecastVars.json";

import usePlotFormatter from "@/composables/usePlotFormatter";

const usePlot = (data, varName, height, width, margin) => {
  const { valueText, dateText } = usePlotFormatter(varName);

  const plotData = computed(() => {
    if (data.value !== undefined) {
      return data.value.forecast.map((d) => ({
        x: new Date(d.timestamp),
        y: d[forecastVars.find((f) => f.name === varName.value).name2],
      }));
    }
    return [{ x: Date.now() }];
  });

  const valueIsValid = (d) => !isNaN(d.y) && d.y !== null;

  const rangeX = computed(() => [
    margin.value.left,
    width.value - margin.value.right,
  ]);

  const rangeY = computed(() => [
    height.value - margin.value.bottom,
    margin.value.top,
  ]);

  const minXVal = computed(() => {
    if (varName.value === "rain") return 0;

    return Math.min(...plotData.value.map((d) => d.x));
  });

  const maxXVal = computed(() => {
    if (varName.value === "rain") return plotData.value.length - 1;
    return Math.max(...plotData.value.map((d) => d.x));
  });

  const minYVal = computed(() => {
    if (varName.value === "rain") return 0;

    const _minVal = Math.min(...plotData.value.map((d) => d.y));
    const minVal = _minVal * 0.95;

    return minVal;
  });

  const maxYVal = computed(() => {
    if (varName.value === "rain") return 1;
    return Math.max(...plotData.value.map((d) => d.y));
  });

  const xScale = computed(() => {
    const x = plotData.value.map((d, i) => i);
    if (varName.value === "rain")
      return d3.scaleBand().range(rangeX.value).domain(x);
    return d3
      .scaleTime()
      .range(rangeX.value)
      .domain(d3.extent(plotData.value, (d) => d.x));
  });

  const yScale = computed(() =>
    d3.scaleLinear().range(rangeY.value).domain([minYVal.value, maxYVal.value])
  );

  const xAxisPath = computed(
    () => `M${xScale.value(minXVal.value)},0H${xScale.value(maxXVal.value)}`
  );

  const xAxisTicks = computed(() => {
    const ticks =
      varName.value === "rain"
        ? plotData.value.map((d) => d.x).filter((d) => d.getHours() === 0)
        : xScale.value.ticks(d3.timeDay.every(1));
    return ticks.map((x) => {
      let transform = `translate(${xScale.value(x)},0)`;
      if (varName.value === "rain") {
        const idx = plotData.value.findIndex((_d) => _d.x === x);
        transform = `translate(${xScale.value(idx)},0)`;
      }
      return { value: x, valueStr: dateText(x), transform };
    });
  });

  const yAxisTicks = computed(() => {
    const ticks =
      varName.value !== "rain" ? yScale.value.ticks(4) : [0, 0.33, 0.67, 1];

    return ticks.map((y) => {
      const transform = `translate(0,${yScale.value(y)})`;
      return { value: y, valueStr: valueText(y), transform };
    });
  });

  return {
    plotData,
    rangeX,
    rangeY,
    minXVal,
    maxXVal,
    minYVal,
    maxYVal,
    xScale,
    yScale,
    xAxisPath,
    xAxisTicks,
    yAxisTicks,
    valueIsValid,
  };
};

export default usePlot;
