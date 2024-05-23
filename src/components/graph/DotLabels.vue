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

<script lang="ts" setup>
  import { computed, toRefs } from 'vue'
  import { timeHour, type TimeInterval } from 'd3'
  import { useStore } from '@nanostores/vue'

  import usePlot from '@/composables/usePlot'
  import usePlotFormatter from '@/composables/usePlotFormatter'
  import { $activeVarName } from '@/stores/forecast'

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
      dotFill?: string
      textFill?: string
    }>(),
    {
      width: screen.width,
      height: screen.width * 0.2,
      margin: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
      dotFill: 'red',
      textFill: 'black',
    },
  )

  const { width, height, margin } = toRefs(props)
  const varName = useStore($activeVarName)

  const {
    plotData,
    xTScale: xScale,
    yScale,
    valueIsValid,
  } = usePlot(height, width, margin)

  const { valueText } = usePlotFormatter(varName)

  const dotLabels = computed(() =>
    xScale.value
      .ticks(timeHour.every(12) as TimeInterval)
      .map((t) => plotData.value.find((d) => d.x.getTime() === t.getTime()))
      .filter(valueIsValid)
      .map((d) => {
        const dt = d === undefined ? new Date() : d.x
        const val = d === undefined ? 0 : d.y
        return {
          valueStr: valueText(val),
          transform: `translate(${xScale.value(dt)},${yScale.value(val)})`,
        }
      }),
  )
</script>

<style scoped>
  text {
    font-size: 1.2rem;
    text-shadow: 0 0 0.6rem #222;
  }
</style>
