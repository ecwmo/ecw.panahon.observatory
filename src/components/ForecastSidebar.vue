<template>
  <div class="flex flex-col space-y-4 items-center">
    <span class="text-xl font-bold">Map</span>
    <div class="flex space-x-2 mb-2">
      <a
        class="py-0.5 px-3 text-xs shadow-lg text-center rounded-full"
        href="#"
        v-for="(v, idx) in forecastImgVariants"
        :key="v"
        @click="$emit('setActiveImgType', idx)"
        :class="[
          activeImgType === idx
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        >{{ v }}</a
      >
    </div>
    <div class="flex flex-col space-y-3">
      <a
        class="py-2 px-4 text-xs shadow-lg text-center"
        href="#"
        v-for="v in forecastVars"
        :key="v.name"
        @click="$emit('setActiveVariable', v.name)"
        :class="[
          activeVariable === v.name
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
      >
        {{ v.title }}
      </a>
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";
import useForecastImg from "@/composables/useForecastImg";

export default {
  name: "ForecastSidebar",
  props: ["forecastVars", "activeVariable", "activeImgType"],
  emits: ["setActiveVariable", "setActiveImgType"],
  setup(props) {
    const { activeVariable } = toRefs(props);

    const { forecastImgVariants } = useForecastImg(activeVariable);

    return {
      forecastImgVariants,
    };
  },
};
</script>
