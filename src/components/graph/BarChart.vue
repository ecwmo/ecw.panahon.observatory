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
      :x="xScale(`${i}`)"
      :y="0"
    ></rect>
    <rect
      fill="none"
      :stroke="stroke"
      :width="xScale.bandwidth()"
      :height="height - margin.bottom - yScale(d.y)"
      :x="xScale(`${i}`)"
      :y="yScale(d.y)"
    ></rect>
    <rect
      :fill="fill"
      stroke="none"
      fill-opacity="0.2"
      :width="xScale.bandwidth()"
      :height="height - margin.bottom - yScale(d.y)"
      :x="xScale(`${i}`)"
      :y="yScale(d.y)"
    ></rect>
  </g>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue'
  import { select as d3Select } from 'd3'

  import usePlot from '@/composables/usePlot'

  const props = withDefaults(
    defineProps<{
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
    }>(),
    {
      width: screen.width,
      height: screen.width * 0.2,
      margin: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
      fill: 'blue',
      stroke: 'blue',
    },
  )

  interface Emits {
    (e: 'setHoveredBar', payload: MouseEvent): void
  }
  defineEmits<Emits>()

  const { width, height, margin } = toRefs(props)

  const { plotData, xScale, yScale } = usePlot(height, width, margin)

  const handleMouseEnter = (ev: MouseEvent) => {
    const bar = d3Select(ev.target as HTMLElement)
    bar.attr('stroke-width', '5px').attr('fill-opacity', '0.1')
  }

  const handleMouseLeave = (ev: MouseEvent) => {
    const bar = d3Select(ev.target as HTMLElement)
    bar.attr('stroke-width', '2px').attr('fill-opacity', '0.25')
  }
</script>
