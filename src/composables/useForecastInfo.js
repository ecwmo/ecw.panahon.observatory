import { computed } from "vue";
import turbineIcon from "@/assets/icons/wind-turbine.png";
import sunIcon from "@/assets/icons/sun.png";
import thermometerIcon from "@/assets/icons/thermometer.png";
import windIcon from "@/assets/icons/wind.png";
import rainCloudIcon from "@/assets/icons/rain-cloud.png";

const useForecastInfo = (forecastData, activeSite, activeDay) => {
  const cleanEnergyData = computed(() => {
    let data = forecastData.value.filter((d) => d.name === activeSite.value);
    if (data.length > 0) {
      data = data[0].forecast[activeDay.value];
      return [
        {
          name: "wpd",
          units: "MW",
          title: "WIND POWER",
          data: [
            { name: "Ave", value: data.wndPow.toFixed(1) },
            { name: "Max", value: data.wndPowMax.toFixed(1) },
          ],
          icon: turbineIcon,
        },
        {
          name: "ppv",
          units: "MW",
          title: "SOLAR POWER",
          data: [
            { name: "Ave", value: data.solPow.toFixed(1) },
            { name: "Max", value: data.solPowMax.toFixed(1) },
          ],
          icon: sunIcon,
        },
      ];
    }

    return [];
  });

  const weatherData = computed(() => {
    let data = forecastData.value.filter((d) => d.name === activeSite.value);
    if (data.length > 0) {
      data = data[0].forecast[activeDay.value];
      return [
        {
          name: "temp",
          units: "°C",
          title: "TEMPERATURE",
          data: [
            { name: "Min", value: data.tempMin.toFixed(1) },
            { name: "Max", value: data.tempMax.toFixed(1) },
          ],
          icon: thermometerIcon,
        },
        {
          name: "wind",
          units: "kph",
          title: "WIND SPEED",
          data: [
            { name: "Min", value: data.wspdMin.toFixed(1) },
            { name: "Max", value: data.wspdMax.toFixed(1) },
          ],
          icon: windIcon,
        },
        {
          name: "rainchance",
          title: "RAIN CHANCE",
          data: [{ value: data.rainChanceStr }],
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

export default useForecastInfo;
