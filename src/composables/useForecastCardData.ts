import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import turbineIcon from '@/assets/icons/wind-turbine.png'
import sunIcon from '@/assets/icons/sun.png'
import thermometerIcon from '@/assets/icons/thermometer.png'
import windIcon from '@/assets/icons/wind.png'
import rainCloudIcon from '@/assets/icons/rain-cloud.png'

import type { ForecastData } from '@/stores/forecast'

export type ForecastCardData = {
  name?: string
  value?: string
}

export type ForecastCardInfo = {
  name: string
  units?: string
  title: string
  data: ForecastCardData[]
  icon: ImageMetadata
}

const useForecastCardData = (forecastData: MaybeRefOrGetter<ForecastData>) => {
  const cleanEnergyData = computed((): ForecastCardInfo[] => {
    const data = toValue(forecastData)
    return data !== undefined
      ? [
          {
            name: 'wpd',
            units: 'MW',
            title: 'WIND POWER',
            data: [
              { name: 'Ave', value: data?.wndPow?.toFixed(1) },
              { name: 'Max', value: data?.wndPowMax?.toFixed(1) },
            ],
            icon: turbineIcon,
          },
          {
            name: 'ppv',
            units: 'MW',
            title: 'SOLAR POWER',
            data: [
              { name: 'Ave', value: data?.solPow?.toFixed(1) },
              { name: 'Max', value: data?.solPowMax?.toFixed(1) },
            ],
            icon: sunIcon,
          },
        ]
      : []
  })

  const weatherData = computed((): ForecastCardInfo[] => {
    const data = toValue(forecastData)
    if (data !== undefined) {
      const rainChanceStr =
        data.rainChanceStr === 'Medium'
          ? 'Med'
          : data.rainChanceStr === 'NoChance'
            ? 'None'
            : data.rainChanceStr ?? undefined
      return [
        {
          name: 'temp',
          units: '°C',
          title: 'TEMPERATURE',
          data: [
            { name: 'Min', value: data?.tempMin?.toFixed(1) },
            { name: 'Max', value: data?.tempMax?.toFixed(1) },
          ],
          icon: thermometerIcon,
        },
        {
          name: 'wind',
          units: 'kph',
          title: 'WIND SPEED',
          data: [
            { name: 'Min', value: data.wspdMin?.toFixed(1) },
            { name: 'Max', value: data.wspdMax?.toFixed(1) },
          ],
          icon: windIcon,
        },
        {
          name: 'rain',
          title: 'RAIN CHANCE',
          data: [{ value: rainChanceStr }],
          icon: rainCloudIcon,
        },
      ]
    }
    return []
  })

  return {
    cleanEnergyData,
    weatherData,
  }
}

export default useForecastCardData
