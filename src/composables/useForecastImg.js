import { computed } from "vue";

const useForecastImg = (activeVariable, activeDay, activeImgType) => {
  const forecastImgVariants = computed(() => {
    if (["wpd", "ppv"].indexOf(activeVariable.value) !== -1)
      return ["Ave", "Max"];
    else if (activeVariable.value === "rain") return [];
    else return ["Min", "Max"];
  });

  const forecastImg = computed(() => {
    let imgTypes = ["min", "max"];
    if (["wpd", "ppv"].indexOf(activeVariable.value) !== -1)
      imgTypes = ["mean", "max"];
    else if (activeVariable.value === "rain") imgTypes = "";

    const hh = activeDay.value < 2 ? (activeDay.value + 1) * 24 : 24;
    const varName =
      activeVariable.value !== "rain" ? activeVariable.value : "rainchance";

    if (imgTypes === "")
      return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${varName}_latest.png`;
    return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${varName}_${
      imgTypes[activeImgType.value]
    }_latest.png`;
  });

  const forecastImgCmap = computed(() => {
    const varName =
      activeVariable.value !== "rain" ? activeVariable.value : "rainchance";
    return `https://panahon.observatory.ph/resources/model/web_img/cmap/wrf-${varName}_cmap.png`;
  });

  return {
    forecastImgVariants,
    forecastImg,
    forecastImgCmap,
  };
};

export default useForecastImg;
