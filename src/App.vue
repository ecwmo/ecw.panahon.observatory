<template>
  <div class="flex flex-col w-full h-screen">
    <Navbar />
    <div
      id="main"
      class="w-full flex flex-col p-4 md:p-6 bg-gray-700 text-gray-200"
    >
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
          <span class="text-3xl mb-3">Clean Power | Weather Forecast</span>
          <SiteDropDown
            :forecastData="forecastDailyData"
            v-model="activeSite"
          />
          <ForecastNavTab
            :activeDay="activeDay"
            @set-active-day="activeDay = $event"
          />
          <transition name="fade">
            <ForecastCards
              :forecastData="forecastDailyData"
              :activeSite="activeSite"
              :activeDay="activeDay"
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
          <ForecastPlot :data="forecastHourlyData" :site="activeSite" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

import Navbar from "@/components/Navbar.vue";
import ForecastSidebar from "@/components/ForecastSidebar.vue";
import ForecastImg from "@/components/ForecastImg.vue";
import SiteDropDown from "@/components/SiteDropDown.vue";
import ForecastNavTab from "@/components/ForecastNavTab.vue";
import ForecastCards from "@/components/ForecastCards.vue";
// import ForecastTable from "@/components/ForecastTable.vue";
import ForecastPlot from "@/components/ForecastPlot.vue";

import useForecastData from "@/composables/useForecastData";

export default {
  name: "App",
  components: {
    Navbar,
    ForecastSidebar,
    ForecastImg,
    SiteDropDown,
    ForecastNavTab,
    ForecastCards,
    ForecastPlot,
  },
  setup() {
    const forecastVars = [
      {
        name: "wpd",
        units: "MW",
        title: "WIND POWER",
      },
      {
        name: "ppv",
        units: "MW",
        title: "SOLAR POWER",
      },
      {
        name: "temp",
        units: "°C",
        title: "TEMPERATURE",
      },
      {
        name: "wind",
        units: "kph",
        title: "WIND SPEED",
      },
      {
        name: "rainchance",
        title: "RAIN CHANCE",
      },
    ];
    const activeSite = ref("NCR");
    const activeDay = ref(0);
    const activeVariable = ref("wpd");
    const activeImgType = ref(0);

    const { forecastDailyData, forecastHourlyData, forecastDateStr } =
      useForecastData();

    const extendedMode = computed(() => activeDay.value > 1);

    return {
      activeSite,
      activeDay,
      activeVariable,
      activeImgType,
      forecastVars,
      forecastDailyData,
      forecastHourlyData,
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
