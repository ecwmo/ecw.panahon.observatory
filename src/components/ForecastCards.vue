<template>
  <div class="flex flex-col p-6 space-y-6">
    <div class="flex justify-center space-x-6">
      <ForecastCard
        v-for="w in cleanEnergyData"
        :key="w.name"
        :title="variableTitle(w.title, w.units)"
        :data="w.data"
        @click="$emit('setActiveVariable', w.name)"
        :class="[
          activeVariable === w.name
            ? 'text-white bg-gray-400'
            : 'text-gray-200 bg-gray-600 hover:bg-gray-200 hover:text-gray-600',
        ]"
      />
    </div>
    <div class="flex justify-center space-x-6">
      <ForecastCard
        v-for="w in weatherData"
        :key="w.name"
        :title="variableTitle(w.title, w.units)"
        :data="w.data"
        @click="$emit('setActiveVariable', w.name)"
        :class="[
          activeVariable === w.name
            ? 'text-white bg-gray-400'
            : 'text-gray-200 bg-gray-600 hover:bg-gray-200 hover:text-gray-600',
        ]"
      />
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";

import ForecastCard from "@/components/ForecastCard.vue";

import useForecastInfo from "@/composables/useForecastInfo";

export default {
  name: "ForecastCards",
  props: ["forecastData", "activeSite", "activeDay", "activeVariable"],
  emits: ["setActiveVariable"],
  components: {
    ForecastCard,
  },
  setup(props) {
    const { forecastData, activeSite, activeDay } = toRefs(props);

    const { cleanEnergyData, weatherData } = useForecastInfo(
      forecastData,
      activeSite,
      activeDay
    );

    const variableTitle = (title, units = "") => {
      if (units !== "") return `${title} (${units})`;
      return title;
    };

    return { cleanEnergyData, weatherData, variableTitle };
  },
};
</script>
