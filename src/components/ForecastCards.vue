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
        class="text-gray-200 bg-gray-600 hover:bg-gray-500 hover:text-gray-300"
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
        class="text-gray-200 bg-gray-600 hover:bg-gray-500 hover:text-gray-300"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useStore } from '@nanostores/vue'

  import { $activeDayData } from '@/stores/forecast'
  import useForecastCardData from '@/composables/useForecastCardData'
  import ForecastCard from '@/components/ForecastCard.vue'

  const data = useStore($activeDayData)

  const { cleanEnergyData, weatherData } = useForecastCardData(data)

  const variableTitle = (title: string, units = '') => {
    if (units !== '') return `${title} (${units})`
    return title
  }
</script>
