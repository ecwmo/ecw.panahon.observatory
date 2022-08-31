<template>
  <div class="flex flex-col-reverse items-center md:flex-row w-full">
    <transition
      name="slide-x-fade"
      enter-active-class="slide-x-fade-enter-active"
      enter-from-class="slide-x-fade-enter-from"
    >
      <div
        v-show="!extendedMode"
        class="relative flex h-full mt-8 ml-8 md:ml-0 md:mt-0"
      >
        <!-- sidebar -->
        <ForecastSidebar
          class="absolute z-10 mt-4 md:mt-8"
          :data="forecastVars"
          v-model:activeVariable="activeVariable"
          v-model:activeType="activeImgType"
        />
        <!-- map -->
        <ForecastImg
          :var-name="activeVariable"
          :day="activeDay"
          :img-type="activeImgType"
          class="relative ml-10 md:-mt-8"
        />
      </div>
    </transition>
    <div class="flex flex-grow flex-col items-start">
      <span class="text-sm font-extralight">{{ forecastDateStr }}</span>
      <span class="text-3xl mb-3">Clean Power • Weather Outlook</span>
      <SiteDropDown v-model="activeSite" :sites="forecastSites" />
      <ForecastNavTab
        :active-day="activeDay"
        @set-active-day="activeDay = $event"
      />
      <transition
        name="slide-y-fade"
        enter-active-class="slide-y-fade-enter-active"
        enter-from-class="slide-y-fade-enter-from"
      >
        <!-- info cards -->
        <ForecastCards v-if="!extendedMode" :data="activeSiteDayData" />
        <!-- graph -->
        <ForecastPlot
          v-else
          class="w-full flex justify-center pt-8"
          :data="activeSiteHourlyData"
        />
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

<script lang="ts">
  import { ref, computed, defineComponent, defineAsyncComponent } from 'vue'
  import { format, addDays } from 'date-fns'

  import ForecastSidebar from '@/components/ForecastSidebar.vue'
  import ForecastImg from '@/components/ForecastImg.vue'
  import SiteDropDown from '@/components/SiteDropDown.vue'
  import ForecastNavTab from '@/components/ForecastNavTab.vue'
  import ForecastCards from '@/components/ForecastCards.vue'

  import _forecastVars from '@/data/forecastVars.json'

  import { ForecastStation, ForecastData } from '@/composables/useForecastData'

  export default defineComponent({
    name: 'App',
    components: {
      ForecastSidebar,
      ForecastImg,
      SiteDropDown,
      ForecastNavTab,
      ForecastCards,
      ForecastPlot: defineAsyncComponent(
        () => import('@/components/ForecastPlot.vue')
      ),
    },
    setup() {
      const currentDate = Date.now()
      const activeSite = ref('NCR')
      const activeDay = ref(0)
      const activeVariable = ref('wpd')
      const activeImgType = ref(0)

      const { forecastDailyData, forecastHourlyData } = useForecastData()

      const activeSiteDayData = computed((): ForecastData => {
        const { forecast } = forecastDailyData.value.find(
          (d) => d.name === activeSite.value
        ) || { forecast: [] }
        return forecast[activeDay.value]
      })

      const activeSiteHourlyData = computed(
        (): ForecastStation =>
          forecastHourlyData.value.find((d) => d.name === activeSite.value) ||
          <ForecastStation>{}
      )

      const forecastVars = computed(() =>
        _forecastVars.map((d) => {
          if (d.name === 'rain') d.title = 'RAIN CHANCE'
          let imgVariants: string[]
          if (['wpd', 'ppv'].indexOf(d.name) !== -1)
            imgVariants = ['Ave', 'Max']
          else if (d.name === 'rain') imgVariants = []
          else imgVariants = ['Min', 'Max']
          return { ...d, imgVariants }
        })
      )

      const forecastSites = computed(() =>
        forecastDailyData.value.map(({ name }) => ({
          name,
        }))
      )

      const extendedMode = computed(() => activeDay.value > 1)

      const forecastDateStr = computed(() =>
        format(
          activeDay.value === 1 ? addDays(currentDate, 1) : currentDate,
          'd MMM yyyy'
        )
      )

      return {
        activeSite,
        activeDay,
        activeVariable,
        activeImgType,
        activeSiteDayData,
        activeSiteHourlyData,
        forecastVars,
        forecastSites,
        forecastDateStr,
        extendedMode,
      }
    },
  })
</script>

<style lang="sass">
  .slide-x-fade-enter-active
    transition: all 0.5s ease-out

  .slide-x-fade-enter-from
    transform: translateX(-30px)
    opacity: 0

  .slide-y-fade-enter-active
    transition: all 0.8s ease-out

  .slide-y-fade-enter-from
    transform: translateY(30px)
    opacity: 0
</style>
