import { computed } from "vue";

const useForecastImg = (activeVariable, activeDay, activeImgType) => {
  const forecastImgVariants = computed(() => {
    if (["wpd", "ppv"].indexOf(activeVariable.value) !== -1)
      return ["Ave", "Max"];
    else if (activeVariable.value === "rainchance") return [];
    else return ["Min", "Max"];
  });

  const forecastImg = computed(() => {
    let imgTypes = ["min", "max"];
    if (["wpd", "ppv"].indexOf(activeVariable.value) !== -1)
      imgTypes = ["mean", "max"];
    else if (activeVariable.value === "rainchance") imgTypes = "";

    const hh = activeDay.value < 2 ? (activeDay.value + 1) * 24 : 24;

    if (imgTypes === "")
      return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${activeVariable.value}_latest.png`;
    return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${
      activeVariable.value
    }_${imgTypes[activeImgType.value]}_latest.png`;
  });

  const forecastImgCmap = computed(
    () =>
      `https://panahon.observatory.ph/resources/model/web_img/cmap/wrf-${activeVariable.value}_cmap.png`
  );

  return {
    forecastImgVariants,
    forecastImg,
    forecastImgCmap,
  };
};

export default useForecastImg;
