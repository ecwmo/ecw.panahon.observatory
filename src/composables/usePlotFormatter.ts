import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { format } from 'date-fns'

import forecastVars from '@/data/forecastVars.json'

const usePlotFormatter = (varName: MaybeRefOrGetter<string>) => {
  const varUnit = computed((): string => {
    const { units } = forecastVars.find((f) => f.name === toValue(varName)) || {
      units: '',
    }
    return units
  })

  const valueText = (d: number | null, withUnits = false) => {
    const vName = toValue(varName)
    if (d === null) return d

    if (!withUnits)
      return vName !== 'rain' ? d.toFixed(1) : (d * 100).toFixed(0)

    if (vName === 'rain') {
      if (d < 0.01) return null
      return `${(d * 100).toFixed(0)} %`
    }

    return `${d.toFixed(1)} ${varUnit.value}`
  }

  const dateText = (d: Date, strFormat = 'eee') => format(d, strFormat)

  return { varUnit, valueText, dateText }
}

export default usePlotFormatter
