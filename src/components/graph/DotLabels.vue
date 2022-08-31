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
  import { PropType } from 'vue'
  import { timeHour, TimeInterval } from 'd3'

  import { ForecastStation } from '@/composables/useForecastData'

  const props = defineProps({
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
    dotFill: {
      default: 'red',
    },
    textFill: {
      default: 'black',
    },
  })

  const { data, varName, width, height, margin } = toRefs(props)

  const {
    plotData,
    xTScale: xScale,
    yScale,
    valueIsValid,
  } = usePlot(data, varName, height, width, margin)

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
      })
  )
</script>

<style lang="sass" scoped>
  text
    font-size: 1.2rem
    text-shadow: 0 0 0.6rem #222
</style>
