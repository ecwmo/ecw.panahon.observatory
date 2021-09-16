import { computed } from "vue";
// import { format } from "date-fns";

const useForecastPlot = (forecastData, activeSite) => {
  const forecastPlotData = computed(() => {
    let data = forecastData.value.filter((d) => d.name === activeSite.value);
    if (data.length > 0) {
      data = {
        dates: data[0].forecast.map((d) => new Date(d.timestamp)),
        values: {
          wpd: data[0].forecast.map((d) =>
            Number.parseFloat(d.wndPow.toFixed(1))
          ),
          ppv: data[0].forecast.map((d) =>
            Number.parseFloat(d.solPow.toFixed(1))
          ),
          temp: data[0].forecast.map((d) =>
            Number.parseFloat(d.temp.toFixed(1))
          ),
          wind: data[0].forecast.map((d) =>
            Number.parseFloat(d.wspd.toFixed(1))
          ),
          rain: data[0].forecast.map((d) =>
            Number.parseFloat(d.rainChance.toFixed(2))
          ),
        },
      };
      return data;
    }
    return {};
  });

  return { forecastPlotData };
};

export default useForecastPlot;
