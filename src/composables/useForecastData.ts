import { computed } from 'vue'
import { add as dfAdd, format as dfFormat } from 'date-fns'
import axios from 'axios'
import { useQuery } from 'vue-query'

export interface ForecastData {
  [index: string]: any
  timestamp: string
  wndPow: number
  wndPowMin: number
  wndPowMax: number
  solPow: number
  solPowMin: number
  solPowMax: number
  temp: number
  tempMin: number
  tempMax: number
  wspd: number
  wspdMin: number
  wspdMax: number
  rain: number
  rainChance: number
  rainStr: string
  rainChanceStr?: string
}

export interface ForecastStation {
  name: string
  lat: number
  lon: number
  forecast: ForecastData[]
}

export interface ForecastStationRaw {
  name: string
  lat: number
  lon: number
  forecast: {
    hr: ForecastData[]
    day: ForecastData[]
  }
}

export interface ForecastStationsRaw {
  [index: string]: ForecastStationRaw
}

const useForecastData = () => {
  const url = 'https://panahon.observatory.ph/api/forecast.php'
  const curDate = new Date(Date.now())

  const fetcher = (): Promise<ForecastStationsRaw> =>
    axios.get(url).then(({ data }) => data)

  const { data } = useQuery('forecastData', fetcher)

  const forecastDailyData = computed((): ForecastStation[] =>
    data.value !== undefined
      ? Object.keys(data.value).map((k) => {
          const {
            forecast: { day },
          } = data.value[k]

          const filteredDays = day.filter(
            (d: ForecastData) =>
              [curDate, dfAdd(curDate, { days: 1 })]
                .map((dd) => dfFormat(dd, 'DDD'))
                .indexOf(dfFormat(new Date(d.timestamp), 'DDD')) !== -1
          )

          return { ...data.value[k], forecast: filteredDays }
        })
      : []
  )

  const forecastHourlyData = computed((): ForecastStation[] =>
    data.value !== undefined
      ? Object.keys(data.value).map((k) => {
          const {
            forecast: { hr },
          } = data.value[k]

          return { ...data.value[k], forecast: hr }
        })
      : []
  )

  return {
    forecastHourlyData,
    forecastDailyData,
  }
}

export default useForecastData
