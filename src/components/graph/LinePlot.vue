<template>
  <g>
    <path :d="areaPlot" stroke="none" :fill="fill" fill-opacity="0.2" />
    <path :d="linePlot" :stroke="stroke" fill="none" ref="linePlotEl" />
    <slot></slot>
  </g>
</template>

<script lang="ts" setup>
  import {
    area as d3Area,
    axisLeft,
    axisTop,
    curveMonotoneX,
    line as d3Line,
    select as d3Select,
  } from 'd3'

  import { Point } from '@/composables/usePlot'

  import { ForecastStation } from '@/composables/useForecastData'

  interface Props {
    data: ForecastStation
    varName: string
    width?: number
    height?: number
    margin?: {
      top: number
      right: number
      bottom: number
      left: number
    }
    fill?: string
    stroke?: string
    isHovered?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    width: screen.width,
    height: screen.width * 0.2,
    margin: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    fill: 'red',
    stroke: 'red',
    isHovered: false,
  })

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
    const area = d3Area<Point>()
      .curve(curveMonotoneX)
      .x((d) => xScale.value(d.x))
      .y0(yScale.value(minYVal.value))
      .y1((d) => yScale.value(d.y))

    return area(plotData.value) || undefined
  })

  const linePlot = computed(() => {
    axisLeft(xScale.value)
    axisTop(yScale.value)
    const line = d3Line<Point>()
      .curve(curveMonotoneX)
      .x((d) => xScale.value(d.x))
      .y((d) => yScale.value(d.y))

    return line(plotData.value) || undefined
  })

  watch([isHovered], () => {
    const line = d3Select(linePlotEl.value)
    const strokeOpacity = isHovered.value ? '0.5' : null
    const fillOpacity = isHovered.value ? '0.1' : '0.25'

    line.attr('stroke-opacity', strokeOpacity).attr('fill-opacity', fillOpacity)
  })
</script>
