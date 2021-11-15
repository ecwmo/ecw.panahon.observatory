import { computed } from "vue";
import turbineIcon from "@/assets/icons/wind-turbine.png";
import sunIcon from "@/assets/icons/sun.png";
import thermometerIcon from "@/assets/icons/thermometer.png";
import windIcon from "@/assets/icons/wind.png";
import rainCloudIcon from "@/assets/icons/rain-cloud.png";

const useForecastCardData = (forecastData) => {
  const cleanEnergyData = computed(() => {
    if (forecastData.value !== undefined) {
      return [
        {
          name: "wpd",
          units: "MW",
          title: "WIND POWER",
          data: [
            { name: "Ave", value: forecastData.value.wndPow.toFixed(1) },
            { name: "Max", value: forecastData.value.wndPowMax.toFixed(1) },
          ],
          icon: turbineIcon,
        },
        {
          name: "ppv",
          units: "MW",
          title: "SOLAR POWER",
          data: [
            { name: "Ave", value: forecastData.value.solPow.toFixed(1) },
            { name: "Max", value: forecastData.value.solPowMax.toFixed(1) },
          ],
          icon: sunIcon,
        },
      ];
    }

    return [];
  });

  const weatherData = computed(() => {
    if (forecastData.value !== undefined) {
      const rainChanceStr =
        forecastData.value.rainChanceStr === "Medium"
          ? "Med"
          : forecastData.value.rainChanceStr === "NoChance"
          ? "None"
          : forecastData.value.rainChanceStr;
      return [
        {
          name: "temp",
          units: "°C",
          title: "TEMPERATURE",
          data: [
            { name: "Min", value: forecastData.value.tempMin.toFixed(1) },
            { name: "Max", value: forecastData.value.tempMax.toFixed(1) },
          ],
          icon: thermometerIcon,
        },
        {
          name: "wind",
          units: "kph",
          title: "WIND SPEED",
          data: [
            { name: "Min", value: forecastData.value.wspdMin.toFixed(1) },
            { name: "Max", value: forecastData.value.wspdMax.toFixed(1) },
          ],
          icon: windIcon,
        },
        {
          name: "rain",
          title: "RAIN CHANCE",
          data: [{ value: rainChanceStr }],
          icon: rainCloudIcon,
        },
      ];
    }
    return [];
  });

  return {
    cleanEnergyData,
    weatherData,
  };
};

export default useForecastCardData;
