import { computed } from "vue";

const useForecastPlot = (forecastData) => {
  const forecastPlotData = computed(() => {
    let data = forecastData.value;
    if (data.length > 0) {
      return data[0].forecast.map((d) => ({
        timestamp: new Date(d.timestamp),
        wpd: d.wndPow,
        ppv: d.solPow,
        temp: d.temp,
        wind: d.wspd,
        rain: d.rainChance,
      }));
    }
    return [];
  });

  return { forecastPlotData };
};

export default useForecastPlot;
