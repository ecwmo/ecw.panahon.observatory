import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  scaleTime,
  scaleLinear,
  scaleBand,
  timeDay,
  type TimeInterval,
} from 'd3'
import { useStore } from '@nanostores/vue'

import forecastVars from '@/data/forecastVars.json'
import { $hourlyData, $activeVarName } from '@/stores/forecast'

import usePlotFormatter from '@/composables/usePlotFormatter'

export type Point = {
  x: Date
  y: number
}

type Margin = {
  top: number
  right: number
  bottom: number
  left: number
}

const usePlot = (
  height: MaybeRefOrGetter<number>,
  width: MaybeRefOrGetter<number>,
  margin: MaybeRefOrGetter<Margin>,
) => {
  const data = useStore($hourlyData)
  const varName = useStore($activeVarName)

  const { valueText, dateText } = usePlotFormatter(varName)

  const plotData = computed((): Point[] => {
    if (data.value !== undefined) {
      return data.value.map((d) => {
        const { name2 } = forecastVars.find(
          (f) => f.name === varName.value,
        ) || { name2: '' }
        return {
          x: new Date(d.timestamp),
          y: (d as Record<string, any>)[name2],
        }
      })
    }
    return [{ x: new Date(), y: 0 }]
  })

  const valueIsValid = (d: Point | undefined) =>
    d !== undefined && !isNaN(d.y) && d.y !== null

  const validPlotData = computed(() => plotData.value.filter(valueIsValid))

  const plotOpts = computed(() => ({
    height: toValue(height),
    width: toValue(width),
    margin: toValue(margin),
  }))

  const rangeX = computed(() => [
    plotOpts.value.margin.left,
    plotOpts.value.width - plotOpts.value.margin.right,
  ])

  const rangeY = computed(() => [
    plotOpts.value.height - plotOpts.value.margin.bottom,
    plotOpts.value.margin.top,
  ])

  const minXVal = computed(() => {
    if (toValue(varName) === 'rain') return 0

    return new Date(Math.min(...plotData.value.map((d) => d.x.getTime())))
  })

  const maxXVal = computed(() => {
    if (toValue(varName) === 'rain') return plotData.value.length - 1

    return new Date(Math.max(...plotData.value.map((d) => d.x.getTime())))
  })

  const minYVal = computed(() => {
    if (toValue(varName) === 'rain') return 0

    return Math.min(...plotData.value.map((d) => d.y)) * 0.95
  })

  const maxYVal = computed(() => {
    if (toValue(varName) === 'rain') return 1
    return Math.max(...plotData.value.map((d) => d.y))
  })

  const xScale = computed(() =>
    scaleBand()
      .range(rangeX.value)
      .domain(plotData.value.map((d, i) => `${i}`)),
  )

  const xTScale = computed(() =>
    scaleTime().range(rangeX.value).domain([minXVal.value, maxXVal.value]),
  )

  const yScale = computed(() =>
    scaleLinear().range(rangeY.value).domain([minYVal.value, maxYVal.value]),
  )

  const xAxisPath = computed(() => {
    if (toValue(varName) === 'rain') {
      const x_min = `${minXVal.value}`
      const x_max = `${maxXVal.value}`
      return `M${xScale.value(x_min)},0H${xScale.value(x_max)}`
    }

    return `M${xTScale.value(minXVal.value)},0H${xTScale.value(maxXVal.value)}`
  })

  const xAxisTicks = computed(() => {
    if (toValue(varName) === 'rain') {
      return plotData.value
        .filter((d) => d.x.getHours() === 0)
        .map((d) => {
          const idx = `${plotData.value.findIndex((_d) => _d.x === d.x)}`
          return {
            value: d.x,
            valueStr: dateText(d.x),
            transform: `translate(${xScale.value(idx)},0)`,
          }
        })
    }
    return xTScale.value.ticks(<TimeInterval>timeDay.every(1)).map((x) => {
      return {
        value: x,
        valueStr: dateText(x),
        transform: `translate(${xTScale.value(x)},0)`,
      }
    })
  })

  const yAxisTicks = computed(() => {
    const ticks =
      toValue(varName) !== 'rain' ? yScale.value.ticks(4) : [0, 0.33, 0.67, 1]

    return ticks.map((y) => {
      const transform = `translate(0,${yScale.value(y)})`
      return { value: y, valueStr: valueText(y), transform }
    })
  })

  return {
    plotData,
    validPlotData,
    rangeX,
    rangeY,
    minXVal,
    maxXVal,
    minYVal,
    maxYVal,
    xScale,
    xTScale,
    yScale,
    xAxisPath,
    xAxisTicks,
    yAxisTicks,
    valueIsValid,
  }
}

export default usePlot
