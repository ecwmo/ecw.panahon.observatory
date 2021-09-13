<template>
  <Navbar />
  <div id="main" class="flex flex-col py-8 px-4 bg-gray-700 text-gray-200">
    <div class="flex">
      <!-- sidebar -->
      <div class="w-1/12 flex flex-col items-center">
        <transition name="fade">
          <ForecastSidebar
            :forecastVars="forecastVars"
            :activeVariable="activeVariable"
            :activeImgType="activeImgType"
            @set-active-variable="activeVariable = $event"
            @set-active-img-type="activeImgType = $event"
            v-show="activeDay <= 1"
          />
        </transition>
      </div>
      <!-- map -->
      <div class="w-1/3 flex flex-col">
        <transition name="fade">
          <ForecastImg
            :varName="activeVariable"
            :imgType="activeImgType"
            v-show="activeDay <= 1"
          />
        </transition>
      </div>
      <!-- info panel -->
      <div class="w-2/3 flex flex-col items-start">
        <span class="text-sm font-extralight">{{ forecastDateStr }}</span>
        <span class="text-3xl mb-3">Clean Power | Weather Forecast</span>
        <div>
          <SiteDropDown :forecastData="forecastData" v-model="activeSite" />
        </div>
        <div class="w-full">
          <nav
            class="text-2xl font-extralight border-b-2 mt-6 flex justify-evenly"
          >
            <a
              class="py-2 px-4 text-center"
              href="#"
              @click="activeDay = 0"
              :class="[
                activeDay === 0 ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
              ]"
              >Today</a
            >
            <a
              class="py-2 px-4 text-center"
              href="#"
              @click="activeDay = 1"
              :class="[
                activeDay === 1 ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
              ]"
              >Tomorrow</a
            >
            <a
              class="py-2 px-4 text-center"
              href="#"
              @click="activeDay = 4"
              :class="[
                activeDay === 4 ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
              ]"
              >Extended</a
            >
          </nav>
        </div>
        <transition name="fade">
          <ForecastCards
            :forecastData="forecastData"
            :activeSite="activeSite"
            :activeDay="activeDay"
            :activeVariable="activeVariable"
            @set-active-variable="activeVariable = $event"
            v-show="activeDay <= 1"
          />
        </transition>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="w-full flex justify-center pt-12" v-show="activeDay > 1">
        <!-- Table -->
        <ForecastTable :data="forecastTableData" />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";

import Navbar from "@/components/Navbar.vue";
import ForecastSidebar from "@/components/ForecastSidebar.vue";
import ForecastImg from "@/components/ForecastImg.vue";
import SiteDropDown from "@/components/SiteDropDown.vue";
import ForecastCards from "@/components/ForecastCards.vue";
import ForecastTable from "@/components/ForecastTable.vue";

import useForecastData from "@/composables/useForecastData";
import useForecastTable from "@/composables/useForecastTable";

export default {
  name: "App",
  components: {
    Navbar,
    ForecastSidebar,
    ForecastImg,
    SiteDropDown,
    ForecastCards,
    ForecastTable,
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

    const { forecastData, forecastDateStr } = useForecastData();

    const { forecastTableData } = useForecastTable(forecastData, activeSite);

    return {
      activeSite,
      activeDay,
      activeVariable,
      activeImgType,
      forecastVars,
      forecastData,
      forecastDateStr,
      forecastTableData,
    };
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 1.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
