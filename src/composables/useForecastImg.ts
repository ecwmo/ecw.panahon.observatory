import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

interface ForecastImgs {
  imgs: string[]
  cmaps: string[]
}

const useForecastImg = (variable = ref(''), day = ref(0), imgType = ref(0)) => {
  const baseUrl = 'https://panahon.observatory.ph'
  const forecastImgs = ref(<ForecastImgs>{})

  const varName = computed(() =>
    variable.value !== 'rain' ? variable.value : 'rainchance'
  )

  const forecastImg = computed(() => {
    let imgTypes: string[] | string = ['min', 'max']
    if (['wpd', 'ppv'].indexOf(variable.value) !== -1)
      imgTypes = ['mean', 'max']
    else if (variable.value === 'rain') imgTypes = ''

    const hh = day.value < 2 ? (day.value + 1) * 24 : 24

    const img = forecastImgs.value?.imgs?.find((i) =>
      i.includes(
        variable.value !== 'rain'
          ? `${hh}hr_${varName.value}_${imgTypes[imgType.value]}`
          : `${hh}hr_${varName.value}`
      )
    )
    return `${baseUrl}/${img}`
  })

  const forecastImgCmap = computed(() => {
    const img = forecastImgs.value?.cmaps?.find((i) =>
      i.includes(varName.value)
    )
    return `${baseUrl}/${img}`
  })

  onMounted(async () => {
    forecastImgs.value = await axios
      .get(`${baseUrl}/api/forecast-img.php`)
      .then(({ data }) => <ForecastImgs>data)
  })

  return {
    forecastImg,
    forecastImgCmap,
  }
}

export default useForecastImg
