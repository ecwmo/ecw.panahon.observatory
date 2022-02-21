<template>
  <div class="flex flex-col">
    <img alt="Map" :src="forecastImg" />
    <div class="h-12">
      <img alt="Colobar" :src="forecastImgCmap" class="transform scale-50" />
    </div>
  </div>
</template>

<script lang="ts">
  import { toRefs, defineComponent } from 'vue'
  import useForecastImg from '@/composables/useForecastImg'

  export default defineComponent({
    name: 'ForecastImg',
    props: {
      varName: { type: String, required: true },
      day: { type: Number, required: true },
      imgType: { type: Number, required: true },
    },
    setup(props) {
      const { varName, day, imgType } = toRefs(props)

      const { forecastImg, forecastImgCmap } = useForecastImg(
        varName,
        day,
        imgType
      )

      return {
        forecastImg,
        forecastImgCmap,
      }
    },
  })
</script>

<style lang="sass" scoped>
  div
    width: 480px
    @media (max-width: 768px)
      width: 420px
    @media (max-width: 640px)
      width: 360px
</style>
