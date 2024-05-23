import { atom, computed } from 'nanostores'
import { z } from 'zod'

import {
  $activeVarName,
  $activeDay,
  $activeImgTypeIdx,
} from '@/stores/forecast'
import { forecastImgSchema } from '@/schemas/forecast'

type ForecastImage = z.infer<typeof forecastImgSchema>

const $data = atom<ForecastImage | undefined>()

export const setData = (imgs?: ForecastImage) => {
  $data.set(imgs)
}

const $_activeVarName = computed($activeVarName, (varName) =>
  varName !== 'rain' ? varName : 'rainchance',
)

const getImgTypes = (varName: string) => {
  const imgTypes = ['min', 'max']
  if (['wpd', 'ppv'].indexOf(varName) !== -1) imgTypes[0] = 'mean'
  else if (varName === 'rainchance') return ''
  return imgTypes
}

const $activeImgType = computed(
  [$_activeVarName, $activeImgTypeIdx],
  (varName, typeIdx) => {
    const imgTypes = getImgTypes(varName)
    return Array.isArray(imgTypes) ? imgTypes[typeIdx] : ''
  },
)

export const $activeImg = computed(
  [$data, $activeDay, $_activeVarName, $activeImgType],
  (data, day, varName, imgType) => {
    const hh = day.value < 2 ? (day.value + 1) * 24 : 2
    return data?.imgs?.find((i) =>
      i.includes(
        varName !== 'rainchance'
          ? `${hh}hr_${varName}_${imgType}`
          : `${hh}hr_${varName}`,
      ),
    )
  },
)

export const $activeImgCmap = computed(
  [$data, $_activeVarName],
  (data, varName) => data?.cmaps?.find((i) => i.includes(varName)),
)
