<template>
  <div class="flex flex-col-reverse items-center md:flex-row w-full">
    <transition
      name="slide-x-fade"
      enter-active-class="slide-x-fade-enter-active"
      enter-from-class="slide-x-fade-enter-from"
    >
      <div
        v-show="!isExtendedMode"
        class="relative flex h-full mt-8 ml-8 md:ml-0 md:mt-0"
      >
        <!-- sidebar -->
        <ForecastSidebar class="absolute z-10 mt-4 md:mt-8" />
        <!-- map -->
        <ForecastImg class="relative ml-10 md:-mt-8" />
      </div>
    </transition>
    <div class="flex flex-grow flex-col items-start">
      <span class="text-sm font-extralight">{{ activeDateStr }}</span>
      <span class="text-3xl mb-3">Clean Power • Weather Outlook</span>
      <SiteDropDown v-model="activeStation" :sites="forecastStations" />
      <ForecastNavTab />
      <transition
        name="slide-y-fade"
        enter-active-class="slide-y-fade-enter-active"
        enter-from-class="slide-y-fade-enter-from"
      >
        <!-- info cards -->
        <ForecastCards v-if="!isExtendedMode" />
        <!-- graph -->
        <ForecastPlot v-else class="w-full flex justify-center pt-8" />
      </transition>
    </div>
  </div>
  <!-- disclaimer -->
  <div
    class="flex w-full pt-8 italic text-xs font-medium text-justify self-center break-words md:break-normal"
  >
    <span class="font-bold">DISCLAIMER</span>: These are experimental forecasts
    for research purposes. For official updates and warnings, please refer to
    PAGASA and other government agencies.
  </div>
</template>

<script setup lang="ts">
  import { computed, watch, defineAsyncComponent } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import { useStore, useVModel } from '@nanostores/vue'
  import axios from 'axios'

  import ForecastSidebar from '@/components/ForecastSidebar.vue'
  import ForecastImg from '@/components/ForecastImg.vue'
  import SiteDropDown from '@/components/SiteDropDown.vue'
  import ForecastNavTab from '@/components/ForecastNavTab.vue'
  import ForecastCards from '@/components/ForecastCards.vue'

  import { forecastStationsRawSchema } from '@/schemas/forecast'

  import {
    setData,
    $activeStation,
    $stations,
    $activeDateStr,
    $isExtendedMode,
  } from '@/stores/forecast'

  const ForecastPlot = defineAsyncComponent(
    () => import('@/components/ForecastPlot.vue'),
  )

  const url = `${import.meta.env.PUBLIC_API_URL}/api/forecast`

  const stations = useStore($stations)
  const activeStation = useVModel($activeStation)
  const activeDateStr = useStore($activeDateStr)
  const isExtendedMode = useStore($isExtendedMode)

  const { data, isSuccess } = useQuery({
    queryKey: ['forecastData'],
    queryFn: async () => {
      const { data } = await axios.get(url)
      return forecastStationsRawSchema.parse(data)
    },
  })

  watch(isSuccess, (isSuccess) => {
    if (isSuccess) {
      setData(data.value)
    }
  })

  const forecastStations = computed(() =>
    stations.value.map(({ name }) => ({
      name,
    })),
  )
</script>

<style>
  .slide-x-fade-enter-active {
    transition: all 0.5s ease-out;
  }
  .slide-x-fade-enter-from {
    transform: translateX(-30px);
    opacity: 0;
  }
  .slide-y-fade-enter-active {
    transition: all 0.8s ease-out;
  }

  .slide-y-fade-enter-from {
    transform: translateY(30px);
    opacity: 0;
  }
</style>
