import { computed } from "vue";
import { format } from "date-fns";

const useForecastTable = (forecastData, activeSite) => {
  const forecastTableData = computed(() => {
    let data = forecastData.value.filter((d) => d.name === activeSite.value);
    if (data.length > 0) {
      data = data[0].forecast.map((d) => ({
        title: format(new Date(d.timestamp), "MMM d"),
        values: [
          ["", `${d.wndPowMax.toFixed(1)} MW`, `${d.wndPow.toFixed(1)} MW`],
          ["", `${d.solPowMax.toFixed(1)} MW`, `${d.solPow.toFixed(1)} MW`],
          [`${d.tempMin.toFixed(1)} °C`, `${d.tempMax.toFixed(1)} °C`, ""],
          [`${d.wspdMin.toFixed(1)} kph`, `${d.wspdMax.toFixed(1)} kph`, ""],
          ["", d.rainChanceStr, ""],
        ],
      }));
      return data;
    }
    return [];
  });

  return { forecastTableData };
};

export default useForecastTable;
