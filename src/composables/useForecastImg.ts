import { computed, ref, Ref } from 'vue'

export interface ForecastImg {
  forecastImgVariants: Ref<string[]>
  forecastImg: Ref<string>
  forecastImgCmap: Ref<string>
}

const useForecastImg = (
  activeVariable: Ref<string>,
  activeDay = ref(0),
  activeImgType = ref(0)
): ForecastImg => {
  const forecastImgVariants = computed(() => {
    if (['wpd', 'ppv'].indexOf(activeVariable.value) !== -1)
      return ['Ave', 'Max']
    else if (activeVariable.value === 'rain') return []
    else return ['Min', 'Max']
  })

  const forecastImg = computed(() => {
    let imgTypes: string[] | string = ['min', 'max']
    if (['wpd', 'ppv'].indexOf(activeVariable.value) !== -1)
      imgTypes = ['mean', 'max']
    else if (activeVariable.value === 'rain') imgTypes = ''

    const hh = activeDay.value < 2 ? (activeDay.value + 1) * 24 : 24
    const varName =
      activeVariable.value !== 'rain' ? activeVariable.value : 'rainchance'

    if (imgTypes === '')
      return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${varName}_latest.png`
    return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${varName}_${
      imgTypes[activeImgType.value]
    }_latest.png`
  })

  const forecastImgCmap = computed(() => {
    const varName =
      activeVariable.value !== 'rain' ? activeVariable.value : 'rainchance'
    return `https://panahon.observatory.ph/resources/model/web_img/cmap/wrf-${varName}_cmap.png`
  })

  return {
    forecastImgVariants,
    forecastImg,
    forecastImgCmap,
  }
}

export default useForecastImg
