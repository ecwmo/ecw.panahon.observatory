import { computed, Ref } from 'vue'
import { scaleTime, scaleLinear, scaleBand, timeDay, TimeInterval } from 'd3'

import forecastVars from '@/data/forecastVars.json'

import { ForecastStation } from '@/composables/useForecastData'
import usePlotFormatter from '@/composables/usePlotFormatter'

export interface Point {
  x: Date
  y: number
}

interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

const usePlot = (
  data: Ref<ForecastStation>,
  varName: Ref<string>,
  height: Ref<number>,
  width: Ref<number>,
  margin: Ref<Margin>
) => {
  const { valueText, dateText } = usePlotFormatter(varName)

  const plotData = computed((): Point[] => {
    if (data.value !== undefined) {
      return data.value.forecast.map((d) => {
        const { name2 } = forecastVars.find(
          (f) => f.name === varName.value
        ) || { name2: '' }
        return {
          x: new Date(d.timestamp),
          y: d[name2],
        }
      })
    }
    return [{ x: new Date(), y: 0 }]
  })

  const valueIsValid = (d: Point | undefined) =>
    d !== undefined && !isNaN(d.y) && d.y !== null

  const validPlotData = computed(() => plotData.value.filter(valueIsValid))

  const rangeX = computed(() => [
    margin.value.left,
    width.value - margin.value.right,
  ])

  const rangeY = computed(() => [
    height.value - margin.value.bottom,
    margin.value.top,
  ])

  const minXVal = computed(() => {
    if (varName.value === 'rain') return 0

    return new Date(Math.min(...plotData.value.map((d) => d.x.getTime())))
  })

  const maxXVal = computed(() => {
    if (varName.value === 'rain') return plotData.value.length - 1

    return new Date(Math.max(...plotData.value.map((d) => d.x.getTime())))
  })

  const minYVal = computed(() => {
    if (varName.value === 'rain') return 0

    return Math.min(...plotData.value.map((d) => d.y)) * 0.95
  })

  const maxYVal = computed(() => {
    if (varName.value === 'rain') return 1
    return Math.max(...plotData.value.map((d) => d.y))
  })

  const xScale = computed(() =>
    scaleBand()
      .range(rangeX.value)
      .domain(plotData.value.map((d, i) => `${i}`))
  )

  const xTScale = computed(() =>
    scaleTime().range(rangeX.value).domain([minXVal.value, maxXVal.value])
  )

  const yScale = computed(() =>
    scaleLinear().range(rangeY.value).domain([minYVal.value, maxYVal.value])
  )

  const xAxisPath = computed(() => {
    if (varName.value === 'rain') {
      const x_min = `${minXVal.value}`
      const x_max = `${maxXVal.value}`
      return `M${xScale.value(x_min)},0H${xScale.value(x_max)}`
    }

    return `M${xTScale.value(minXVal.value)},0H${xTScale.value(maxXVal.value)}`
  })

  const xAxisTicks = computed(() => {
    if (varName.value === 'rain') {
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
      varName.value !== 'rain' ? yScale.value.ticks(4) : [0, 0.33, 0.67, 1]

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
