<template>
  <div>
    <img alt="Map" :src="forecastImg" />
    <img alt="Colobar" :src="forecastImgCmap" class="transform scale-50" />
  </div>
</template>

<script>
import { toRefs } from "vue";
import useForecastImg from "@/composables/useForecastImg";

export default {
  name: "ForecastImg",
  props: ["varName", "imgType"],
  setup(props) {
    const { varName, imgType } = toRefs(props);

    const { forecastImg, forecastImgCmap } = useForecastImg(varName, imgType);

    return {
      forecastImg,
      forecastImgCmap,
    };
  },
};
</script>
