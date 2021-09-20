<template>
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
      <text fill="currentColor" y="9" dy="0.71em">
        {{ xAxisTick.valueStr }}
      </text>
    </g>
  </g>
</template>

<script>
import { toRefs } from "vue";

import usePlot from "@/composables/usePlot";

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

    const { xAxisPath, xAxisTicks } = usePlot(
      data,
      varName,
      height,
      width,
      margin
    );

    return {
      xAxisPath,
      xAxisTicks,
    };
  },
};
</script>

<style lang="sass" scoped>
text
  font-size: 1.4rem
</style>
