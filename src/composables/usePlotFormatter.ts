import { computed, Ref } from 'vue'
import { format } from 'date-fns'

import forecastVars from '@/data/forecastVars.json'

const usePlotFormatter = (varName: Ref<string>) => {
  const varUnit = computed((): string => {
    const { units } = forecastVars.find((f) => f.name === varName.value) || {
      units: '',
    }
    return units
  })

  const valueText = (d: number | null, withUnits = false) => {
    if (d === null) return d

    if (!withUnits)
      return varName.value !== 'rain' ? d.toFixed(1) : (d * 100).toFixed(0)

    if (varName.value === 'rain') {
      if (d < 0.01) return null
      return `${(d * 100).toFixed(0)} %`
    }

    return `${d.toFixed(1)} ${varUnit.value}`
  }

  const dateText = (d: Date, strFormat = 'eee') => format(d, strFormat)

  return { varUnit, valueText, dateText }
}

export default usePlotFormatter
