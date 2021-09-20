<template>
  <div class="flex flex-col w-full justify-center">
    <nav
      class="
        text-lg
        font-extralight
        border-b border-grey-800
        mt-4
        flex
        justify-start
      "
    >
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
          v-for="xAxisTick in xAxisTicks"
          :key="xAxisTick.value"
          :transform="xAxisTick.transform"
        >
          <line stroke="currentColor" y2="6"></line>
          <text fill="currentColor" y="9" dy="0.71em" class="xAxisText">
            {{ xAxisTick.valueStr }}
          </text>
        </g>
      </g>
      <!-- y-axis -->
      <g>
        <g
          v-for="(yAxisTick, i) in yAxisTicks"
          :key="yAxisTick.value"
          :transform="yAxisTick.transform"
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
            v-if="i === yAxisTicks.length - 1"
            :x="margin.left"
            y="-6"
            text-anchor="start"
            alignment-baseline="top"
            fill="currentColor"
            stroke="none"
            class="yAxisUnit"
          >
            {{ varUnit }}
          </text>
          <text
            :x="margin.left - 6"
            text-anchor="end"
            alignment-baseline="middle"
            fill="currentColor"
            stroke="none"
            class="yAxisText"
          >
            {{ yAxisTick.valueStr }}
          </text>
        </g>
      </g>
      <!-- default plot -->
      <LinePlot
        v-if="activeVariable !== 'rain'"
        :data="data"
        :varName="activeVariable"
        :stroke="stroke"
        :fill="fill"
        :height="height"
        :width="width"
        :margin="margin"
        :isHovered="isHovered"
      >
        <!-- labels -->
        <DotLabels
          v-show="!isHovered"
          :data="data"
          :varName="activeVariable"
          :height="height"
          :width="width"
          :margin="margin"
          :dotFill="dotColor"
          :textFill="dotColor"
        />
      </LinePlot>
      <!-- barchart -->
      <BarChart
        v-else
        :data="data"
        :varName="activeVariable"
        :stroke="stroke"
        :fill="fill"
        :height="height"
        :width="width"
        :margin="margin"
        @set-hovered-bar="hoveredBar = $event"
      />
      <!-- tooltip -->
      <g id="tooltip" v-show="isHovered">
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

import forecastVars from "@/data/forecastVars.json";

import usePlot from "@/composables/usePlot";
import usePlotFormatter from "@/composables/usePlotFormatter";

import LinePlot from "@/components/graph/LinePlot.vue";
import BarChart from "@/components/graph/BarChart.vue";
import DotLabels from "@/components/graph/DotLabels.vue";

export default {
  name: "ForecastPlot",
  props: {
    data: {
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
  components: {
    LinePlot,
    BarChart,
    DotLabels,
  },
  setup(props) {
    const activeVariable = ref("wpd");
    const hoveredBar = ref();

    const margin = ref({ top: 40, right: 30, bottom: 30, left: 40 });
    const { data, width, height } = toRefs(props);
    const isHovered = ref(false);

    const {
      plotData,
      rangeY,
      xScale,
      yScale,
      xAxisPath,
      xAxisTicks,
      yAxisTicks,
      valueIsValid,
    } = usePlot(data, activeVariable, height, width, margin);

    const { varUnit, valueText, dateText } = usePlotFormatter(activeVariable);

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

    const dotColor = computed(() => {
      const { dotColor } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return dotColor;
    });

    const valueTextColor = computed(() => {
      const { dotColor } = forecastVars.find(
        (f) => f.name === activeVariable.value
      );

      return dotColor;
    });

    const handleMouseMove = (ev) => {
      let i;
      let transform = "";
      let pt;
      const tooltip = d3.select("#tooltip");

      if (activeVariable.value !== "rain") {
        const pointer = d3.pointer(ev);
        const xm = xScale.value.invert(pointer[0]);
        const dates = plotData.value.map((d) => d.x);

        i = d3.bisectCenter(dates, xm);
        pt = plotData.value[i];
        transform = `translate(${xScale.value(pt.x)},${yScale.value(pt.y)})`;
      } else {
        if (hoveredBar.value !== undefined) {
          const bar = d3.select(hoveredBar.value.target);
          const x = bar.select("rect").attr("x");
          i = hoveredBar.value.target.dataset["index"];
          pt = plotData.value[i];

          transform = `translate(${x},${rangeY.value[1]})`;
        }
      }

      if (valueIsValid(pt)) {
        tooltip.attr("transform", transform);
        tooltip.select("text").text(valueText(pt.y, true));
        tooltip.select("text:last-of-type").text(dateText(pt.x, "MMM d, haaa"));
      }
    };

    const handleMouseEnter = () => {
      isHovered.value = true;
    };

    const handleMouseLeave = () => {
      isHovered.value = false;
    };

    return {
      margin,
      viewBox,
      stroke,
      fill,
      forecastVars,
      plotData,
      activeVariable,
      xAxisPath,
      xAxisTicks,
      yAxisTicks,
      dotColor,
      valueTextColor,
      varUnit,
      isHovered,
      hoveredBar,
      handleMouseMove,
      handleMouseEnter,
      handleMouseLeave,
    };
  },
};
</script>

<style lang="sass" scoped>
svg
  font-size: 0.8rem
  stroke-width: 2px
#tooltip
  .dateText
    font-size: 0.8rem
  text-shadow: 0 0 0.6rem #222
.valueText
  font-size: 1.2rem
  text-shadow: 0 0 0.6rem #222
.xAxisText
  font-size: 1.4rem
.yAxisText
  font-size: 1rem
.yAxisUnit
  font-size: 0.8rem
</style>
