<template>
  <g>
    <g v-for="d in dotLabels" :key="d.transform" :transform="d.transform">
      <circle :fill="dotFill" stroke="none" r="6"></circle>
      <text y="-14" :fill="textFill" stroke="none" text-anchor="middle">
        {{ d.valueStr }}
      </text>
    </g>
  </g>
</template>

<script>
import { toRefs, computed } from "vue";
import * as d3 from "d3";

import usePlot from "@/composables/usePlot";
import usePlotFormatter from "@/composables/usePlotFormatter";

export default {
  name: "DotLabels",
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
    dotFill: {
      default: "red",
    },
    textFill: {
      default: "black",
    },
  },
  setup(props) {
    const { data, varName, width, height, margin } = toRefs(props);

    const { plotData, xScale, yScale, valueIsValid } = usePlot(
      data,
      varName,
      height,
      width,
      margin
    );

    const { valueText } = usePlotFormatter(varName);

    const dotLabels = computed(() =>
      xScale.value
        .ticks(d3.timeHour.every(12))
        .map((t) => plotData.value.find((d) => d.x.getTime() === t.getTime()))
        .filter(valueIsValid)
        .map((d) => {
          return {
            valueStr: valueText(d.y),
            transform: `translate(${xScale.value(d.x)},${yScale.value(d.y)})`,
          };
        })
    );

    return {
      dotLabels,
    };
  },
};
</script>

<style lang="sass" scoped>
text
  font-size: 1.2rem
  text-shadow: 0 0 0.6rem #222
</style>
