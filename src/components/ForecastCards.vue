<template>
  <div class="w-full flex flex-col flex-wrap mt-3 md:mt-6 gap-3 md:gap-6">
    <div class="flex flex-wrap justify-center gap-3 md:gap-6">
      <ForecastCard
        v-for="w in cleanEnergyData"
        :key="w.name"
        :title="variableTitle(w.title, w.units)"
        :data="w.data"
        :icon="w.icon"
        :name="w.name"
        :class="[
          activeVariable === w.name
            ? 'text-white bg-gray-400'
            : 'text-gray-200 bg-gray-600 hover:bg-gray-200 hover:text-gray-600',
        ]"
        @click="$emit('setActiveVariable', w.name)"
      />
    </div>
    <div class="flex flex-wrap justify-center gap-3 md:gap-6">
      <ForecastCard
        v-for="w in weatherData"
        :key="w.name"
        :title="variableTitle(w.title, w.units)"
        :data="w.data"
        :icon="w.icon"
        :name="w.name"
        :class="[
          activeVariable === w.name
            ? 'text-white bg-gray-400'
            : 'text-gray-200 bg-gray-600 hover:bg-gray-200 hover:text-gray-600',
        ]"
        @click="$emit('setActiveVariable', w.name)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { toRefs, defineComponent, PropType } from 'vue'

  import ForecastCard from '@/components/ForecastCard.vue'

  import useForecastCardData from '@/composables/useForecastCardData'
  import { ForecastData } from '@/composables/useForecastData'

  export default defineComponent({
    name: 'ForecastCards',
    components: {
      ForecastCard,
    },
    props: {
      forecastData: { type: Object as PropType<ForecastData>, required: true },
      activeVariable: { type: String, required: true },
    },
    emits: ['setActiveVariable'],
    setup(props) {
      const { forecastData } = toRefs(props)

      const { cleanEnergyData, weatherData } = useForecastCardData(forecastData)

      const variableTitle = (title: string, units = '') => {
        if (units !== '') return `${title} (${units})`
        return title
      }

      return { cleanEnergyData, weatherData, variableTitle }
    },
  })
</script>
