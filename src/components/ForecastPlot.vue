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
    <svg
      :viewBox="viewBox"
      @mousemove.prevent.stop="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- x-axis -->
      <g
        :transform="`translate(0,${height - margin.bottom})`"
        fill="none"
        text-anchor="middle"
      >
        <path stroke="currentColor" :d="xAxisPath"></path>
        <g
          v-for="(xAxisTick, i) in xAxisTicks"
          :key="i"
          :transform="xAxisTickTransform(xAxisTick)"
        >
          <line stroke="currentColor" y2="6"></line>
          <text fill="currentColor" y="9" dy="0.71em" class="xAxisText">
            {{ dateText(xAxisTick) }}
          </text>
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
        <path :d="linePlot" :stroke="stroke" fill="none" id="linePlot" />
        <!-- labels -->
        <template v-for="(d, i) in plotData">
          <template v-if="valueIsValid(d)">
            <g
              :key="i"
              :transform="`translate(${xScale(d.timestamp)},${yScale(
                d.value
              )})`"
              class="valueLabels"
            >
              <template v-if="i % 12 === 0">
                <circle :fill="dotColor" stroke="none" r="0.4rem"></circle>
                <text
                  v-if="i !== 0"
                  y="-1rem"
                  :fill="valueTextColor"
                  stroke="none"
                  text-anchor="middle"
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
        <g
          v-for="(d, i) in plotData"
          :key="i"
          :transform="`translate(${-xScale.bandwidth() / 2},0)`"
          :data-index="i"
          class="bar"
          @mouseenter="handleBarMouseEnter"
          @mouseleave="handleBarMouseLeave"
        >
          <rect
            :fill="fill"
            stroke="none"
            fill-opacity="0"
            :width="xScale.bandwidth()"
            :height="height - margin.bottom"
            :x="xScale(i)"
            :y="0"
          ></rect>
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
      </g>
      <!-- tooltip -->
      <g id="tooltip" display="none">
        <circle
          v-if="activeVariable !== 'rain'"
          :fill="dotColor"
          stroke="none"
          r="0.4rem"
        ></circle>
        <text
          y="-0.6rem"
          :fill="valueTextColor"
          stroke="none"
          class="valueText"
          text-anchor="middle"
        ></text>
        <text
          y="-1.8rem"
          fill="#ddd"
          stroke="none"
          class="dateText"
          text-anchor="middle"
        ></text>
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
      default: screen.width * 0.25,
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

    const xAxisTickTransform = (d) => {
      if (activeVariable.value === "rain") {
        const idx = plotData.value.findIndex((_d) => _d.timestamp === d);
        return `translate(${xScale.value(idx)},0)`;
      }
      return `translate(${xScale.value(d)},0)`;
    };

    const xAxisTicks = computed(() => {
      if (activeVariable.value === "rain") {
        return plotData.value
          .map((d) => d.timestamp)
          .filter((d) => d.getHours() === 0);
      }
      return xScale.value.ticks(d3.timeDay.every(1));
    });

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

    const handleMouseMove = (ev) => {
      if (activeVariable.value !== "rain") {
        const tooltip = d3.select("#tooltip");

        const values = plotData.value.map((d) => d.value);
        const dates = plotData.value.map((d) => d.timestamp);

        const pointer = d3.pointer(ev);
        const xm = xScale.value.invert(pointer[0]);

        const i = d3.bisectCenter(dates, xm);

        if (valueIsValid(plotData.value[i])) {
          tooltip.attr(
            "transform",
            `translate(${xScale.value(dates[i])},${yScale.value(values[i])})`
          );
          tooltip.select("text").text(valueText(values[i], true));
          tooltip
            .select("text:last-of-type")
            .text(dateText(dates[i], "MMM d, haaa"));
        }
      }
    };

    const handleMouseEnter = () => {
      const tooltip = d3.select("#tooltip");
      const valueLabels = d3.selectAll(".valueLabels");
      const linePlot = d3.select("#linePlot");

      linePlot.attr("stroke-opacity", "0.5").attr("fill-opacity", "0.1");
      valueLabels.attr("display", "none");
      tooltip.attr("display", null);
    };

    const handleMouseLeave = () => {
      const tooltip = d3.select("#tooltip");
      const valueLabels = d3.selectAll(".valueLabels");
      const linePlot = d3.select("#linePlot");

      linePlot.attr("stroke-opacity", null).attr("fill-opacity", "0.25");
      tooltip.attr("display", "none");
      valueLabels.attr("display", null);
    };

    const handleBarMouseEnter = (ev) => {
      const bar = d3.select(ev.target);
      const x = bar.select("rect").attr("x");

      const tooltip = d3.select("#tooltip");
      const valueLabels = d3.selectAll(".valueLabels");

      const i = ev.target.dataset["index"];

      tooltip
        .attr("display", null)
        .attr("transform", `translate(${x},${rangeY.value[1]})`);
      tooltip.select("text").text(valueText(plotData.value[i].value, true));
      tooltip
        .select("text:last-of-type")
        .text(dateText(plotData.value[i].timestamp, "MMM d, haaa"));

      bar.attr("stroke-width", "5px").attr("fill-opacity", "0.1");
      valueLabels.attr("display", "none");
    };

    const handleBarMouseLeave = (ev) => {
      const tooltip = d3.select("#tooltip");
      const valueLabels = d3.selectAll(".valueLabels");
      const bar = d3.select(ev.target);

      bar.attr("stroke-width", "2px").attr("fill-opacity", "0.25");
      tooltip.attr("display", "none");
      valueLabels.attr("display", null);
    };

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
      xAxisTicks,
      yAxisTicks,
      areaPlot,
      linePlot,
      dotColor,
      valueIsValid,
      valueTextColor,
      dateText,
      valueText,
      handleMouseMove,
      handleMouseEnter,
      handleMouseLeave,
      handleBarMouseEnter,
      handleBarMouseLeave,
    };
  },
};
</script>

<style lang="sass" scoped>
svg
  font-size: 0.8rem
  stroke-width: 2px
#tooltip
  .valueText
    font-size: 1rem
  .dateText
    font-size: 0.8rem
.valueText
  font-size: 1rem
  text-shadow: 0 0 0.6em #222
.xAxisText
  font-size: 1.4rem
.yAxisText
  font-size: 1rem
</style>
