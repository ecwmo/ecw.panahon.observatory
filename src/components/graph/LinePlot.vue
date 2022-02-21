<template>
  <g>
    <path :d="areaPlot" stroke="none" :fill="fill" fill-opacity="0.2" />
    <path :d="linePlot" :stroke="stroke" fill="none" ref="linePlotEl" />
    <slot></slot>
  </g>
</template>

<script lang="ts">
  import { ref, toRefs, computed, watch, defineComponent, PropType } from 'vue'
  import {
    line as d3line,
    area as d3area,
    axisLeft,
    axisTop,
    curveMonotoneX,
    select,
  } from 'd3'

  import usePlot, { Point } from '@/composables/usePlot'

  import { ForecastStation } from '@/composables/useForecastData'

  export default defineComponent({
    name: 'LinePlot',
    props: {
      data: {
        type: Object as PropType<ForecastStation>,
        required: true,
      },
      varName: {
        type: String,
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
        type: String,
        default: 'red',
      },
      stroke: {
        type: String,
        default: 'red',
      },
      isHovered: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const { data, varName, width, height, margin, isHovered } = toRefs(props)
      const linePlotEl = ref()

      const {
        validPlotData: plotData,
        xTScale: xScale,
        yScale,
        minYVal,
      } = usePlot(data, varName, height, width, margin)

      const areaPlot = computed(() => {
        axisLeft(xScale.value)
        axisTop(yScale.value)
        const area = d3area<Point>()
          .curve(curveMonotoneX)
          .x((d) => xScale.value(d.x))
          .y0(yScale.value(minYVal.value))
          .y1((d) => yScale.value(d.y))

        return area(plotData.value) || undefined
      })

      const linePlot = computed(() => {
        axisLeft(xScale.value)
        axisTop(yScale.value)
        const line = d3line<Point>()
          .curve(curveMonotoneX)
          .x((d) => xScale.value(d.x))
          .y((d) => yScale.value(d.y))

        return line(plotData.value) || undefined
      })

      watch([isHovered], () => {
        const line = select(linePlotEl.value)
        const strokeOpacity = isHovered.value ? '0.5' : null
        const fillOpacity = isHovered.value ? '0.1' : '0.25'

        line
          .attr('stroke-opacity', strokeOpacity)
          .attr('fill-opacity', fillOpacity)
      })

      return {
        areaPlot,
        linePlot,
        linePlotEl,
      }
    },
  })
</script>
