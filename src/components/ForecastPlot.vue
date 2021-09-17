<template>
  <div class="flex flex-col w-full justify-center">
    <nav class="text-lg font-extralight border-b-2 mt-4 flex justify-start">
      <a
        v-for="v in forecastVars"
        :key="v.name"
        class="py-2 px-4 text-center"
        href="#"
        @click.prevent="activeVariable = v.name"
        :class="[
          activeVariable === v.name
            ? 'bg-gray-500 font-bold'
            : 'hover:bg-gray-500',
        ]"
        >{{ v.title }}</a
      >
    </nav>
    <!-- plot area -->
    <svg :viewBox="viewBox">
      <!-- x-axis -->
      <g
        :transform="`translate(0,${height - margin.bottom})`"
        fill="none"
        text-anchor="middle"
      >
        <path stroke="currentColor" :d="xAxisPath"></path>
        <g
          v-for="(d, i) in plotData"
          :key="i"
          :transform="xAxisTickTransform(d, i)"
        >
          <template v-if="i % 6 === 0">
            <line stroke="currentColor" y2="6"></line>
            <template v-if="i % 24 === 0">
              <text fill="currentColor" y="9" dy="0.71em" class="xAxisText">
                {{ dateText(d.timestamp) }}
              </text>
            </template>
          </template>
        </g>
      </g>
      <!-- y-axis -->
      <g>
        <g
          v-for="(yAxisTick, i) in yAxisTicks"
          :key="i"
          :transform="`translate(0,${yScale(yAxisTick)})`"
          fill="none"
          text-anchor="middle"
        >
          <path
            stroke="currentColor"
            :d="xAxisPath"
            stroke-dasharray="3,3"
            stroke-width="0.05em"
          ></path>
          <text
            :x="margin.left - 6"
            text-anchor="end"
            alignment-baseline="middle"
            fill="currentColor"
            stroke="none"
            class="yAxisText"
          >
            {{ valueText(yAxisTick) }}
          </text>
        </g>
      </g>
      <!-- default plot -->
      <g v-if="activeVariable !== 'rain'">
        <path :d="areaPlot" stroke="none" :fill="fill" fill-opacity="0.2" />
        <path :d="linePlot" :stroke="stroke" fill="none" />
        <!-- labels -->
        <template v-for="(d, i) in plotData">
          <template v-if="valueIsValid(d)">
            <g
              :key="i"
              :transform="`translate(${xScale(d.timestamp)},${yScale(
                d.value
              )})`"
              text-anchor="middle"
            >
              <template v-if="i % 12 === 0">
                <circle :fill="dotColor" stroke="none" r="0.4rem"></circle>
                <text
                  v-if="i !== 0"
                  y="-1rem"
                  :fill="valueTextColor"
                  stroke="none"
                  class="valueText"
                >
                  {{ valueText(d.value, true) }}
                </text>
              </template>
            </g>
          </template>
        </template>
      </g>
      <!-- histogram -->
      <g v-else>
        <template v-for="(d, i) in plotData" :key="i">
          <g :transform="`translate(${-xScale.bandwidth() / 2},0)`">
            <rect
              fill="none"
              :stroke="stroke"
              :width="xScale.bandwidth()"
              :height="height - margin.bottom - yScale(d.value)"
              :x="xScale(i)"
              :y="yScale(d.value)"
            ></rect>
            <rect
              :fill="fill"
              stroke="none"
              fill-opacity="0.2"
              :width="xScale.bandwidth()"
              :height="height - margin.bottom - yScale(d.value)"
              :x="xScale(i)"
              :y="yScale(d.value)"
            ></rect>
          </g>
        </template>
      </g>
    </svg>
  </div>
</template>

<script>
import { ref, computed, toRefs } from "vue";
import * as d3 from "d3";
import { format } from "date-fns";

import useForecastPlot from "@/composables/useForecastPlot";

export default {
  name: "ForecastPlot",
  props: {
    data: {
      required: true,
    },
    site: {
      required: true,
    },
    width: {
      default: screen.width,
      type: Number,
    },
    height: {
      default: screen.width * 0.2,
      type: Number,
    },
  },
  setup(props) {
    const activeVariable = ref("wpd");

    const forecastVars = [
      {
        name: "wpd",
        units: "MW",
        title: "WIND ENERGY",
        stroke: "#6EE7B7",
        fill: "#D1FAE5",
        dotColor: "#34D399",
      },
      {
        name: "ppv",
        units: "MW",
        title: "SOLAR ENERGY",
        stroke: "#FBBF24",
        fill: "#FDE68A",
        dotColor: "#F59E0B",
      },
      {
        name: "temp",
        units: "°C",
        title: "TEMPERATURE",
        stroke: "#DC2626",
        fill: "#F87171",
        dotColor: "#B91C1C",
      },
      {
        name: "wind",
        units: "kph",
        title: "WIND",
        stroke: "#8B5CF6",
        fill: "#C4B5FD",
        dotColor: "#7C3AED",
      },
      {
        name: "rain",
        title: "RAIN",
        stroke: "#2563EB",
        fill: "#60A5FA",
        dotColor: "#1D4ED8",
      },
    ];

    const margin = { top: 40, right: 30, bottom: 30, left: 40 };
    const { data, site, width, height } = toRefs(props);

    const { forecastPlotData } = useForecastPlot(data, site);

    const plotData = computed(() => {
      if (forecastPlotData.value.length > 0)
        return forecastPlotData.value.map((d) => ({
          timestamp: d.timestamp,
          value: d[activeVariable.value],
        }));
      return forecastPlotData.value;
    });

    const rangeX = computed(() => [margin.left, width.value - margin.right]);
    const rangeY = computed(() => [height.value - margin.bottom, margin.top]);

    const minXVal = computed(() => {
      if (activeVariable.value === "rain") return 0;

      return Math.min(...plotData.value.map((d) => d.timestamp));
    });

    const maxXVal = computed(() => {
      if (activeVariable.value === "rain") return plotData.value.length - 1;
      return Math.max(...plotData.value.map((d) => d.timestamp));
    });

    const minVal = computed(() => {
      if (activeVariable.value === "rain") return 0;

      const _minVal = Math.min(...plotData.value.map((d) => d.value));
      const minVal = _minVal * 0.95;

      return minVal;
    });

    const maxVal = computed(() => {
      if (activeVariable.value === "rain") return 1;
      return Math.max(...plotData.value.map((d) => d.value));
    });

    const xScale = computed(() => {
      const x = plotData.value.map((d, i) => i);
      if (activeVariable.value === "rain")
        return d3.scaleBand().range(rangeX.value).domain(x);
      return d3
        .scaleTime()
        .range(rangeX.value)
        .domain(d3.extent(plotData.value, (d) => d.timestamp));
    });

    const yScale = computed(() =>
      d3.scaleLinear().range(rangeY.value).domain([minVal.value, maxVal.value])
    );

    const areaPlot = computed(() => {
      d3.axisLeft().scale(xScale.value);
      d3.axisTop().scale(yScale.value);
      const area = d3
        .area()
        .defined(valueIsValid)
        .curve(d3.curveMonotoneX)
        .x((d) => xScale.value(d.timestamp))
        .y0(yScale.value(minVal.value))
        .y1((d) => yScale.value(d.value));

      return area(plotData.value.filter(area.defined()));
    });

    const linePlot = computed(() => {
      d3.axisLeft().scale(xScale.value);
      d3.axisTop().scale(yScale.value);
      const line = d3
        .line()
        .defined(valueIsValid)
        .curve(d3.curveMonotoneX)
        .x((d) => xScale.value(d.timestamp))
        .y((d) => yScale.value(d.value));

      return line(plotData.value.filter(line.defined()));
    });

    const viewBox = computed(() => `0 0 ${width.value} ${height.value}`);

    const stroke = computed(() => {
      const { stroke } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return stroke;
    });

    const fill = computed(() => {
      const { fill } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return fill;
    });

    const xAxisPath = computed(
      () => `M${xScale.value(minXVal.value)},0H${xScale.value(maxXVal.value)}`
    );

    const xAxisTickTransform = (d, i) => {
      if (activeVariable.value === "rain") {
        return `translate(${xScale.value(i)},0)`;
      }
      return `translate(${xScale.value(d.timestamp)},0)`;
    };

    const yAxisTicks = computed(() => yScale.value.ticks(4));

    const dotColor = computed(() => {
      const { dotColor } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return dotColor;
    });

    const valueIsValid = (d) => !isNaN(d.value) && d.value !== null;

    const valueText = (d, withUnits = false) => {
      const { units } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      if (d === null) return d;

      if (!withUnits) return activeVariable.value !== "rain" ? d : d * 100;

      if (activeVariable.value === "rain") {
        if (d < 0.01) return null;
        if (!withUnits) return (d * 100).toFixed(0);
        return `${(d * 100).toFixed(0)} %`;
      }

      return `${d.toFixed(1)} ${units}`;
    };

    const valueTextColor = computed(() => {
      const { dotColor } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return dotColor;
    });

    const dateText = (d, strFormat = "eee") => format(d, strFormat);

    return {
      margin,
      viewBox,
      stroke,
      fill,
      forecastVars,
      plotData,
      activeVariable,
      xScale,
      yScale,
      xAxisPath,
      xAxisTickTransform,
      yAxisTicks,
      areaPlot,
      linePlot,
      dotColor,
      valueIsValid,
      valueTextColor,
      dateText,
      valueText,
    };
  },
};
</script>

<style lang="sass" scoped>
svg
  font-size: 0.8rem
  stroke-width: 2px
.valueText
  font-size: 1rem
  text-shadow: 0 0 0.6em #222
.xAxisText
  font-size: 1.4rem
.yAxisText
  font-size: 1rem
</style>
