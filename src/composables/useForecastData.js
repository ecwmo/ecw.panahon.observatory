import { computed } from "vue";
import axios from "axios";
import { useQuery } from "vue-query";

const useForecastData = () => {
  const url = "https://panahon.observatory.ph/api/forecast.php";
  const curDate = new Date(Date.now());

  const fetcher = () => axios.get(url).then(({ data }) => data);

  const { data } = useQuery("forecastData", fetcher);

  const forecastDailyData = computed(() =>
    data.value !== undefined
      ? Object.keys(data.value).map((k) => {
          const {
            forecast: { day },
          } = data.value[k];

          const filteredDays = day.filter(
            (d) =>
              [curDate.getDate(), curDate.getDate() + 1].indexOf(
                new Date(d.timestamp).getDate()
              ) !== -1
          );

          return { ...data.value[k], forecast: filteredDays };
        })
      : []
  );

  const forecastHourlyData = computed(() =>
    data.value !== undefined
      ? Object.keys(data.value).map((k) => {
          const {
            forecast: { hr },
          } = data.value[k];

          return { ...data.value[k], forecast: hr };
        })
      : []
  );

  return {
    forecastHourlyData,
    forecastDailyData,
  };
};

export default useForecastData;
