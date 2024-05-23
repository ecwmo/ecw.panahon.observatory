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
  import { toRefs } from 'vue'
  import { useStore } from '@nanostores/vue'

  import { $activeVarName } from '@/stores/forecast'
  import usePlot from '@/composables/usePlot'
  import usePlotFormatter from '@/composables/usePlotFormatter'

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
    }>(),
    {
      width: screen.width,
      height: screen.width * 0.2,
      margin: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    },
  )

  const { width, height, margin } = toRefs(props)
  const varName = useStore($activeVarName)

  const { xAxisPath, yAxisTicks } = usePlot(height, width, margin)

  const { varUnit } = usePlotFormatter(varName)
</script>

<style scoped>
  text {
    font-size: 1rem;
  }
  #unit {
    font-size: 0.8rem;
  }
</style>
