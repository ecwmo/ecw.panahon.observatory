<template>
  <div class="flex flex-col w-96">
    <img alt="Map" :src="forecastImg" />
    <img alt="Colobar" :src="forecastImgCmap" class="transform scale-50" />
  </div>
</template>

<script>
import { toRefs } from "vue";
import useForecastImg from "@/composables/useForecastImg";

export default {
  name: "ForecastImg",
  props: ["varName", "day", "imgType"],
  setup(props) {
    const { varName, day, imgType } = toRefs(props);

    const { forecastImg, forecastImgCmap } = useForecastImg(
      varName,
      day,
      imgType
    );

    return {
      forecastImg,
      forecastImgCmap,
    };
  },
};
</script>
