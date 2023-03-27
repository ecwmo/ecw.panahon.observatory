<template>
  <div class="flex flex-col w-full justify-center">
    <nav
      class="text-sm md:text-lg font-extralight border-b border-grey-800 mt-2 md:mt-4 flex justify-start"
    >
      <a
        v-for="v in forecastVars"
        :key="v.name"
        class="p-1.5 md:py-2 md:px-4 text-center"
        href="#"
        :class="[
          activeVariable === v.name
            ? 'bg-gray-500 font-semibold'
            : 'hover:bg-gray-500',
        ]"
        @click.prevent="activeVariable = v.name"
        >{{ v.title }}</a
      >
    </nav>
    <!-- plot area -->
    <svg
      :viewBox="viewBox"
      @mousemove.prevent.stop="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- x-axis -->
      <GraphXAxis
        :data="data"
        :var-name="activeVariable"
        :height="height"
        :width="width"
        :margin="margin"
      />
      <!-- y-axis -->
      <GraphYAxis
        :data="data"
        :var-name="activeVariable"
        :height="height"
        :width="width"
        :margin="margin"
      />
      <!-- default plot -->
      <GraphLinePlot
        v-if="activeVariable !== 'rain'"
        :data="data"
        :var-name="activeVariable"
        :stroke="stroke"
        :fill="fill"
        :height="height"
        :width="width"
        :margin="margin"
        :is-hovered="isHovered"
      >
        <!-- labels -->
        <GraphDotLabels
          v-show="!isHovered"
          :data="data"
          :var-name="activeVariable"
          :height="height"
          :width="width"
          :margin="margin"
          :dot-fill="dotColor"
          :text-fill="dotColor"
        />
      </GraphLinePlot>
      <!-- barchart -->
      <GraphBarChart
        v-else
        :data="data"
        :var-name="activeVariable"
        :stroke="stroke"
        :fill="fill"
        :height="height"
        :width="width"
        :margin="margin"
        @set-hovered-bar="hoveredBar = $event"
      />
      <!-- tooltip -->
      <g v-show="isHovered" id="tooltip">
        <circle
          v-if="activeVariable !== 'rain'"
          :fill="dotColor"
          stroke="none"
          r="6"
        ></circle>
        <text
          y="-10"
          :fill="valueTextColor"
          stroke="none"
          class="valueText"
          text-anchor="middle"
        ></text>
        <text
          y="-30"
          fill="#ddd"
          stroke="none"
          class="dateText"
          text-anchor="middle"
        ></text>
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import { bisectCenter, pointer as d3Pointer, select as d3Select } from 'd3'

  import forecastVars from '@/data/forecastVars.json'

  import { ForecastStation } from '@/composables/useForecastData'

  interface Props {
    data: ForecastStation
  }
  const props = defineProps<Props>()

  const activeVariable = ref('wpd')
  const hoveredBar = ref()

  const margin = ref({ top: 40, right: 30, bottom: 30, left: 40 })

  const { data } = toRefs(props)
  const isHovered = ref(false)

  const width = computed(() => screen.width)

  const height = computed(() => {
    if (screen.width < 640) return screen.width * 0.6
    else if (screen.width < 768) return screen.width * 0.3
    return screen.width * 0.2
  })

  const {
    plotData,
    rangeY,
    xTScale: xScale,
    yScale,
    valueIsValid,
  } = usePlot(data, activeVariable, height, width, margin)

  const { valueText, dateText } = usePlotFormatter(activeVariable)

  const viewBox = computed(() => `0 0 ${width.value} ${height.value}`)

  const stroke = computed(() => {
    const { stroke } = forecastVars.find(
      (f) => f.name === activeVariable.value
    ) || { stroke: 'black' }

    return stroke
  })

  const fill = computed(() => {
    const { fill } = forecastVars.find(
      (f) => f.name === activeVariable.value
    ) || { fill: 'black' }

    return fill
  })

  const dotColor = computed(() => {
    const { dotColor } = forecastVars.find(
      (f) => f.name === activeVariable.value
    ) || { dotColor: 'black' }

    return dotColor
  })

  const valueTextColor = computed(() => {
    const { dotColor } = forecastVars.find(
      (f) => f.name === activeVariable.value
    ) || { dotColor: 'black' }

    return dotColor
  })

  const handleMouseMove = (ev: MouseEvent) => {
    let i
    let transform = ''
    let pt = { x: new Date(), y: 0 }
    const tooltip = d3Select('#tooltip')

    if (activeVariable.value !== 'rain') {
      const pointer = d3Pointer(ev)
      const xm = xScale.value.invert(pointer[0])
      const dates = plotData.value.map((d) => d.x)

      i = bisectCenter(dates, xm)
      pt = plotData.value[i]
      transform = `translate(${xScale.value(pt.x)},${yScale.value(pt.y)})`
    } else {
      if (hoveredBar.value !== undefined) {
        const bar = d3Select(hoveredBar.value.target)
        const x = bar.select('rect').attr('x')
        i = hoveredBar.value.target.dataset['index']
        pt = plotData.value[i]

        transform = `translate(${x},${rangeY.value[1]})`
      }
    }

    if (valueIsValid(pt)) {
      tooltip.attr('transform', transform)
      tooltip.select('text').text(valueText(pt.y, true))
      tooltip.select('text:last-of-type').text(dateText(pt.x, 'MMM d, haaa'))
    }
  }

  const handleMouseEnter = () => {
    isHovered.value = true
  }

  const handleMouseLeave = () => {
    isHovered.value = false
  }
</script>

<style lang="sass" scoped>
  svg
    font-size: 0.8rem
    stroke-width: 2px
  #tooltip
    .dateText
      font-size: 0.8rem
    text-shadow: 0 0 0.6rem #222
  .valueText
    font-size: 1.2rem
    text-shadow: 0 0 0.6rem #222
</style>
