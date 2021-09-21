import { computed } from "vue";
import { format } from "date-fns";
import axios from "axios";
import { useQuery } from "vue-query";

const useForecastData = () => {
  const url = "https://panahon.observatory.ph/api/forecast.php";

  const fetcher = () => axios.get(url).then(({ data }) => data);

  const { data } = useQuery("forecastData", fetcher);

  const forecastDailyData = computed(() =>
    data.value !== undefined
      ? Object.keys(data.value).map((k) => {
          const {
            forecast: { day },
          } = data.value[k];

          return { ...data.value[k], forecast: day };
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

  const forecastTimestamp = computed(() =>
    data.value !== undefined
      ? new Date(forecastDailyData.value[0].forecast[0].timestamp)
      : Date.now()
  );

  const forecastDateStr = computed(() =>
    format(forecastTimestamp.value, "d MMM yyyy")
  );

  return {
    forecastHourlyData,
    forecastDailyData,
    forecastTimestamp,
    forecastDateStr,
  };
};

export default useForecastData;
