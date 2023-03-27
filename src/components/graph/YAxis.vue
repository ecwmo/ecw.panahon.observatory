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
        v-if="i === yAxisTicks.length - 1"
        id="unit"
        :x="margin.left"
        y="-6"
        text-anchor="start"
        alignment-baseline="baseline"
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

<script lang="ts" setup>
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
  }
  const props = withDefaults(defineProps<Props>(), {
    width: screen.width,
    height: screen.width * 0.2,
    margin: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  })

  const { data, varName, width, height, margin } = toRefs(props)

  const { xAxisPath, yAxisTicks } = usePlot(
    data,
    varName,
    height,
    width,
    margin
  )

  const { varUnit } = usePlotFormatter(varName)
</script>

<style lang="sass" scoped>
  text
    font-size: 1rem
  #unit
    font-size: 0.8rem
</style>
