<template>
  <div class="flex flex-col">
    <img alt="Map" :src="forecastImg" data-test="map" />
    <div class="h-12">
      <img
        alt="Colobar"
        :src="forecastImgCmap"
        class="transform scale-50"
        data-test="colorbar"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    varName: string
    day?: number
    imgType?: number
  }
  const props = withDefaults(defineProps<Props>(), { day: 0, imgType: 0 })

  const { varName, day, imgType } = toRefs(props)

  const { forecastImg, forecastImgCmap } = useForecastImg(varName, day, imgType)
</script>

<style lang="sass" scoped>
  div
    width: 480px
    @media (max-width: 768px)
      width: 420px
    @media (max-width: 640px)
      width: 360px
</style>
