import { ref, onMounted, computed } from "vue";
import { format } from "date-fns";
import axios from "axios";

const useForecastData = () => {
  const forecastHourlyData = ref([]);
  const forecastDailyData = ref([]);
  const forecastTimestamp = ref(Date.now());

  const fetchForecast = async () => {
    try {
      const url = "https://panahon.observatory.ph/api/forecast.php";
      const _forecastData = await axios.get(url).then(({ data }) => data);
      forecastDailyData.value = Object.keys(_forecastData).map((k) => {
        const {
          forecast: { day },
        } = _forecastData[k];

        return { ..._forecastData[k], forecast: day };
      });
      forecastHourlyData.value = Object.keys(_forecastData).map((k) => {
        const {
          forecast: { hr },
        } = _forecastData[k];

        return { ..._forecastData[k], forecast: hr };
      });
      forecastTimestamp.value = new Date(
        forecastDailyData.value[0].forecast[0].timestamp
      );
    } catch (err) {
      if (err.response) {
        // client received an error response (5xx, 4xx)
        console.log("Server Error:", err);
      } else if (err.request) {
        // client never received a response, or request never left
        console.log("Network Error:", err);
      } else {
        console.log("Client Error:", err);
      }
    }
  };

  onMounted(fetchForecast);

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
