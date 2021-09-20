<template>
  <g>
    <path :d="areaPlot" stroke="none" :fill="fill" fill-opacity="0.2" />
    <path :d="linePlot" :stroke="stroke" fill="none" ref="linePlotEl" />
    <slot></slot>
  </g>
</template>

<script>
import { ref, toRefs, computed, watch } from "vue";
import * as d3 from "d3";

import usePlot from "@/composables/usePlot";

export default {
  name: "LinePlot",
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
      default: "red",
    },
    stroke: {
      default: "red",
    },
    isHovered: {
      default: "false",
    },
  },
  setup(props) {
    const { data, varName, width, height, margin, isHovered } = toRefs(props);
    const linePlotEl = ref();

    const { plotData, xScale, yScale, minYVal, valueIsValid } = usePlot(
      data,
      varName,
      height,
      width,
      margin
    );

    const areaPlot = computed(() => {
      d3.axisLeft().scale(xScale.value);
      d3.axisTop().scale(yScale.value);
      const area = d3
        .area()
        .defined(valueIsValid)
        .curve(d3.curveMonotoneX)
        .x((d) => xScale.value(d.x))
        .y0(yScale.value(minYVal.value))
        .y1((d) => yScale.value(d.y));

      return area(plotData.value.filter(area.defined()));
    });

    const linePlot = computed(() => {
      d3.axisLeft().scale(xScale.value);
      d3.axisTop().scale(yScale.value);
      const line = d3
        .line()
        .defined(valueIsValid)
        .curve(d3.curveMonotoneX)
        .x((d) => xScale.value(d.x))
        .y((d) => yScale.value(d.y));

      return line(plotData.value.filter(line.defined()));
    });

    watch([isHovered], () => {
      const line = d3.select(linePlotEl.value);
      const strokeOpacity = isHovered.value ? "0.5" : null;
      const fillOpacity = isHovered.value ? "0.1" : "0.25";

      line
        .attr("stroke-opacity", strokeOpacity)
        .attr("fill-opacity", fillOpacity);
    });

    return {
      areaPlot,
      linePlot,
      linePlotEl,
    };
  },
};
</script>
