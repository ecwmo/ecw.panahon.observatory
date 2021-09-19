<template>
  <g
    v-for="(d, i) in plotData"
    :key="i"
    :transform="`translate(${-xScale.bandwidth() / 2},0)`"
    :data-index="i"
    @mouseenter="handleMouseEnter($event), $emit('setHoveredBar', $event)"
    @mouseleave="handleMouseLeave"
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
      :height="height - margin.bottom - yScale(d.y)"
      :x="xScale(i)"
      :y="yScale(d.y)"
    ></rect>
    <rect
      :fill="fill"
      stroke="none"
      fill-opacity="0.2"
      :width="xScale.bandwidth()"
      :height="height - margin.bottom - yScale(d.y)"
      :x="xScale(i)"
      :y="yScale(d.y)"
    ></rect>
  </g>
</template>

<script>
import { toRefs } from "vue";
import * as d3 from "d3";

import usePlot from "@/composables/usePlot";

export default {
  name: "BarChart",
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
    fill: {
      default: "blue",
    },
    stroke: {
      default: "blue",
    },
  },
  emits: ["setHoveredBar"],
  setup(props) {
    const { data, varName, width, height, margin } = toRefs(props);

    const { plotData, xScale, yScale } = usePlot(
      data,
      varName,
      height,
      width,
      margin
    );

    const handleMouseEnter = (ev) => {
      const bar = d3.select(ev.target);
      bar.attr("stroke-width", "5px").attr("fill-opacity", "0.1");
    };

    const handleMouseLeave = (ev) => {
      const bar = d3.select(ev.target);
      bar.attr("stroke-width", "2px").attr("fill-opacity", "0.25");
    };

    return {
      plotData,
      xScale,
      yScale,
      handleMouseEnter,
      handleMouseLeave,
    };
  },
};
</script>
