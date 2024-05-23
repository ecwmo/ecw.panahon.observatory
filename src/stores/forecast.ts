import { atom, computed } from 'nanostores'
import { z } from 'zod'
import { format, add, addDays } from 'date-fns'

import _forecastVars from '@/data/forecastVars.json'
import {
  forecastStationsRawSchema,
  forecastDataSchema,
} from '@/schemas/forecast'

type ForecastStationsRaw = z.infer<typeof forecastStationsRawSchema>

export type ForecastData = z.infer<typeof forecastDataSchema>

export type ForecastStation = {
  name: string
  lat: number
  lon: number
  forecast: ForecastData[]
}

export type ForecastVariable = {
  name: string
  title: string
  imgVariants: string[]
}

export const days = [
  { label: 'Today', value: 0 },
  { label: 'Tomorrow', value: 1 },
  { label: 'Extended', value: 4 },
]
export const $activeDay = atom(days[0])
export const setActiveDay = (val: number) => {
  const day = days.find(({ value }) => value === val)
  if (day) $activeDay.set(day)
}

export const $isExtendedMode = computed([$activeDay], (day) => day.value > 1)

const $curDate = atom(new Date())

export const $activeDateStr = computed([$curDate, $activeDay], (cDate, day) =>
  format(day.value === 1 ? addDays(cDate, 1) : cDate, 'd MMM yyyy'),
)

export const forecastVariables = _forecastVars.map((d) => {
  if (d.name === 'rain') d.title = 'RAIN CHANCE'
  let imgVariants: string[]
  if (['wpd', 'ppv'].indexOf(d.name) !== -1) imgVariants = ['Ave', 'Max']
  else if (d.name === 'rain') imgVariants = []
  else imgVariants = ['Min', 'Max']
  return { ...d, imgVariants }
})

export const $activeVarName = atom('wpd')
export const setActiveVarName = (val: string) => {
  $activeVarName.set(val)
}

export const $activeImgTypeIdx = atom(0)
export const setActiveImgTypeIdx = (val: number) => {
  $activeImgTypeIdx.set(val)
}

const $data = atom<ForecastStationsRaw | undefined>()
export const setData = (newData?: ForecastStationsRaw) => {
  $data.set(newData)
  $curDate.set(new Date())
}

export const $activeStation = atom<string>('NCR')

export const $stations = computed([$data], (data) =>
  data !== undefined
    ? Object.keys(data).map((k) => {
        const { name, lat, lon } = data[k]
        return { name, lat, lon }
      })
    : [],
)

export const $dailyData = computed(
  [$data, $curDate, $activeStation],
  (data, curDate, stn) =>
    data?.[stn]?.forecast?.day?.filter(
      (d) =>
        [curDate, add(curDate, { days: 1 })]
          .map((dd) => format(dd, 'DDD'))
          .indexOf(format(new Date(d.timestamp), 'DDD')) !== -1,
    ),
)

export const $activeDayData = computed(
  [$dailyData, $activeDay],
  (data, day) => data?.[day.value],
)

export const $hourlyData = computed(
  [$data, $activeStation],
  (data, stn) => data?.[stn]?.forecast?.hr,
)
