import { computed, ref, Ref } from 'vue'

const useForecastImg = (
  variable: Ref<string>,
  day = ref(0),
  imgType = ref(0)
) => {
  const forecastImg = computed(() => {
    let imgTypes: string[] | string = ['min', 'max']
    if (['wpd', 'ppv'].indexOf(variable.value) !== -1)
      imgTypes = ['mean', 'max']
    else if (variable.value === 'rain') imgTypes = ''

    const hh = day.value < 2 ? (day.value + 1) * 24 : 24
    const varName = variable.value !== 'rain' ? variable.value : 'rainchance'

    if (variable.value === 'rain')
      return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${varName}_latest.png`
    return `https://panahon.observatory.ph/resources/model/web_img/wrf-${hh}hr_${varName}_${
      imgTypes[imgType.value]
    }_latest.png`
  })

  const forecastImgCmap = computed(() => {
    const varName = variable.value !== 'rain' ? variable.value : 'rainchance'
    return `https://panahon.observatory.ph/resources/model/web_img/cmap/wrf-${varName}_cmap.png`
  })

  return {
    forecastImg,
    forecastImgCmap,
  }
}

export default useForecastImg
