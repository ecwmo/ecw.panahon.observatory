<template>
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
        id="unit"
        v-if="i === yAxisTicks.length - 1"
        :x="margin.left"
        y="-6"
        text-anchor="start"
        alignment-baseline="top"
        fill="currentColor"
        stroke="none"
      >
        {{ varUnit }}
      </text>
      <text
        :x="margin.left - 6"
        text-anchor="end"
        alignment-baseline="middle"
        fill="currentColor"
        stroke="none"
      >
        {{ yAxisTick.valueStr }}
      </text>
    </g>
  </g>
</template>

<script>
import { toRefs } from "vue";

import usePlot from "@/composables/usePlot";
import usePlotFormatter from "@/composables/usePlotFormatter";

export default {
  name: "XAxis",
  props: {
    data: {
      required: true,
    },
    varName: {
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
    margin: {
      default: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },
  setup(props) {
    const { data, varName, width, height, margin } = toRefs(props);

    const { xAxisPath, yAxisTicks } = usePlot(
      data,
      varName,
      height,
      width,
      margin
    );

    const { varUnit } = usePlotFormatter(varName);

    return {
      xAxisPath,
      yAxisTicks,
      varUnit,
    };
  },
};
</script>

<style lang="sass" scoped>
text
  font-size: 1rem
#unit
  font-size: 0.8rem
</style>
