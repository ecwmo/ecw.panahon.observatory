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
    <svg :viewBox="viewBox">
      <g
        :transform="`translate(0,${height - margin.bottom})`"
        fill="none"
        text-anchor="middle"
      >
        <path stroke="currentColor" :d="xAxisPath"></path>
        <g
          v-for="(d, i) in plotData.dates"
          :key="i"
          opacity="1"
          :transform="`translate(${xScale(i)},0)`"
        >
          <line stroke="currentColor" y2="6"></line>
          <text fill="currentColor" y="9" dy="0.71em">{{ dateText(d) }}</text>
        </g>
      </g>
      <g v-if="activeVariable !== 'rain'">
        <path :d="areaPlot" stroke="none" :fill="fill" opacity="0.5" />
        <path :d="linePlot" :stroke="stroke" fill="none" />
        <g
          v-for="(d, i) in plotData.values"
          :key="i"
          :transform="`translate(${xScale(i)},${yScale(d)})`"
          text-anchor="middle"
        >
          <circle :fill="dotColor" stroke="none" r="2.4"></circle>
          <text y="-8" :fill="dotColor" stroke="none">{{ valueText(d) }}</text>
        </g>
      </g>
      <g v-else>
        <g
          v-for="(d, i) in plotData.values"
          :key="i"
          :transform="`translate(${-xScale.bandwidth() / 2},0)`"
        >
          <rect
            :fill="fill"
            :stroke="stroke"
            :width="xScale.bandwidth()"
            :height="height - margin.bottom - yScale(d)"
            :x="xScale(i)"
            :y="yScale(d)"
          ></rect>
        </g>
        <g
          v-for="(d, i) in plotData.values"
          :key="i"
          :transform="`translate(${xScale(i)},${yScale(d)})`"
          text-anchor="middle"
        >
          <circle :fill="dotColor" stroke="none" r="2.4"></circle>
          <text y="-8" :fill="dotColor" stroke="none">{{ valueText(d) }}</text>
        </g>
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
      default: 400,
      type: Number,
    },
    height: {
      default: 100,
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

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const { data, site, width, height } = toRefs(props);

    const { forecastPlotData } = useForecastPlot(data, site);

    const isEmpty = (obj) => {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
      }
      return true;
    };

    const plotData = computed(() => {
      if (!isEmpty(forecastPlotData.value)) {
        const { dates, values } = forecastPlotData.value;
        return {
          dates: dates,
          values: values[activeVariable.value],
        };
      }
      return {
        dates: [],
        values: [],
      };
    });

    const rangeX = computed(() => [margin.left, width.value - margin.right]);
    const rangeY = computed(() => [height.value - margin.bottom, margin.top]);

    const minVal = computed(() => {
      if (activeVariable.value === "rain") return 0;

      const _minVal = Math.min(...plotData.value.values);
      const minVal = _minVal * 0.95;

      return minVal;
    });

    const maxVal = computed(() => Math.max(...plotData.value.values));

    const xScale = computed(() => {
      const x = plotData.value.dates.map((d, i) => i);
      if (activeVariable.value === "rain")
        return d3.scaleBand().range(rangeX.value).padding(0.3).domain(x);
      return d3
        .scaleLinear()
        .range(rangeX.value)
        .domain([0, x.length - 1]);
    });

    const yScale = computed(() =>
      d3.scaleLinear().range(rangeY.value).domain([minVal.value, maxVal.value])
    );

    const areaPlot = computed(() => {
      d3.axisLeft().scale(xScale.value);
      d3.axisTop().scale(yScale.value);
      return d3
        .area()
        .x((d, i) => xScale.value(i))
        .y0(yScale.value(minVal.value))
        .y1((d) => yScale.value(d))(plotData.value.values);
    });

    const linePlot = computed(() => {
      d3.axisLeft().scale(xScale.value);
      d3.axisTop().scale(yScale.value);
      return d3
        .line()
        .x((d, i) => xScale.value(i))
        .y((d) => yScale.value(d))(plotData.value.values);
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

    const xAxisPath = computed(() => {
      const n = plotData.value.dates.length;
      const s = xScale.value(0);
      const e = xScale.value(n - 1);
      return `M${s},0H${e}`;
    });

    const dotColor = computed(() => {
      const { dotColor } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return dotColor;
    });

    const valueText = (d) => {
      const { units } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      if (activeVariable.value === "rain") {
        const val = (d * 100).toFixed(0);
        return `${val} %`;
      }

      if (units === undefined) return d;
      return `${d} ${units}`;
    };

    const dateText = (d) => format(d, "eee");

    return {
      margin,
      forecastVars,
      activeVariable,
      xScale,
      yScale,
      xAxisPath,
      areaPlot,
      linePlot,
      viewBox,
      stroke,
      fill,
      dotColor,
      dateText,
      valueText,
      plotData,
    };
  },
};
</script>

<style lang="sass" scoped>
svg
  font-size: 0.4rem
path
  stroke-width: 1px
</style>
