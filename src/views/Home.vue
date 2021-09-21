<template>
  <div class="flex flex-col-reverse items-center md:flex-row w-full">
    <transition name="fade">
      <div class="flex" v-show="!extendedMode">
        <!-- sidebar -->
        <div class="flex flex-col items-center mt-8 md:mt-6">
          <ForecastSidebar
            :forecastVars="forecastVars"
            :activeVariable="activeVariable"
            :activeImgType="activeImgType"
            @set-active-variable="activeVariable = $event"
            @set-active-img-type="activeImgType = $event"
          />
        </div>
        <!-- map -->
        <div class="flex flex-col">
          <ForecastImg
            :varName="activeVariable"
            :day="activeDay"
            :imgType="activeImgType"
          />
        </div>
      </div>
    </transition>
    <!-- info panel -->
    <div class="flex flex-grow flex-col items-start">
      <span class="text-sm font-extralight">{{ forecastDateStr }}</span>
      <span class="text-3xl mb-3">Clean Power • Weather Forecast</span>
      <SiteDropDown :sites="forecastSites" v-model="activeSite" />
      <ForecastNavTab
        :activeDay="activeDay"
        @set-active-day="activeDay = $event"
      />
      <transition name="fade">
        <ForecastCards
          :forecastData="activeSiteDayData"
          :activeVariable="activeVariable"
          @set-active-variable="activeVariable = $event"
          v-show="!extendedMode"
        />
      </transition>
    </div>
  </div>
  <!-- Graph -->
  <transition name="slide-fade">
    <div class="w-full flex justify-center pt-8" v-show="extendedMode">
      <ForecastPlot :data="activeSiteHourlyData" />
    </div>
  </transition>
  <!-- Disclaimer -->
  <div
    class="
      flex
      w-full
      pt-8
      italic
      text-xs
      font-medium
      text-justify
      self-center
      break-words
      md:break-normal
    "
  >
    <span class="font-bold">DISCLAIMER</span>: These are experimental forecasts
    for research purposes. For official updates and warnings, please refer to
    PAGASA and other government agencies.
  </div>
</template>

<script>
import { ref, computed } from "vue";

import ForecastSidebar from "@/components/ForecastSidebar.vue";
import ForecastImg from "@/components/ForecastImg.vue";
import SiteDropDown from "@/components/SiteDropDown.vue";
import ForecastNavTab from "@/components/ForecastNavTab.vue";
import ForecastCards from "@/components/ForecastCards.vue";
import ForecastPlot from "@/components/ForecastPlot.vue";

import _forecastVars from "@/data/forecastVars.json";

import useForecastData from "@/composables/useForecastData";

export default {
  name: "App",
  components: {
    ForecastSidebar,
    ForecastImg,
    SiteDropDown,
    ForecastNavTab,
    ForecastCards,
    ForecastPlot,
  },
  setup() {
    const activeSite = ref("NCR");
    const activeDay = ref(0);
    const activeVariable = ref("wpd");
    const activeImgType = ref(0);

    const { forecastDailyData, forecastHourlyData, forecastDateStr } =
      useForecastData();

    const activeSiteDayData = computed(() => {
      const data = forecastDailyData.value.find(
        (d) => d.name === activeSite.value
      );
      if (data !== undefined) return data.forecast[activeDay.value];
      return data;
    });

    const activeSiteHourlyData = computed(() =>
      forecastHourlyData.value.find((d) => d.name === activeSite.value)
    );

    const forecastVars = computed(() =>
      _forecastVars.map((d) => {
        if (d.name === "rain") d.title = "RAIN CHANCE";
        return d;
      })
    );

    const forecastSites = computed(() =>
      forecastDailyData.value.map(({ name }) => ({
        name,
      }))
    );

    const extendedMode = computed(() => activeDay.value > 1);

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
    };
  },
};
</script>

<style>
.fade-enter-active {
  transition: opacity 0.6s ease-out;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.8s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(30px);
  opacity: 0;
}
</style>
