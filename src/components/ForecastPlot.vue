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
      <XAxis
        :data="data"
        :varName="activeVariable"
        :height="height"
        :width="width"
        :margin="margin"
      />
      <!-- y-axis -->
      <YAxis
        :data="data"
        :varName="activeVariable"
        :height="height"
        :width="width"
        :margin="margin"
      />
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

import XAxis from "@/components/graph/XAxis.vue";
import YAxis from "@/components/graph/YAxis.vue";
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
    XAxis,
    YAxis,
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

    const { plotData, rangeY, xScale, yScale, valueIsValid } = usePlot(
      data,
      activeVariable,
      height,
      width,
      margin
    );

    const { valueText, dateText } = usePlotFormatter(activeVariable);

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
      dotColor,
      valueTextColor,
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
</style>
