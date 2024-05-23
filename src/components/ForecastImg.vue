<template>
  <div class="flex flex-col">
    <img alt="Map" :src="activeImgMap" data-test="map" />
    <div class="h-12">
      <img
        alt="Colobar"
        :src="activeImgCmap"
        class="transform scale-50"
        data-test="colorbar"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { mapStores } from '@nanostores/vue'
  import { useQuery } from '@tanstack/vue-query'
  import axios from 'axios'

  import { $activeImg, $activeImgCmap, setData } from '@/stores/forecastImg'
  import { forecastImgSchema } from '@/schemas/forecast'

  const baseUrl = import.meta.env.PUBLIC_API_URL

  const activeImage = mapStores({
    img: $activeImg,
    cmap: $activeImgCmap,
  })

  const { data, isSuccess } = useQuery({
    queryKey: ['forecastImgs'],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/api/forecast?img=2`)
      return forecastImgSchema.parse(data)
    },
  })

  watch(isSuccess, (isSuccess) => {
    if (isSuccess) {
      setData(data.value)
    }
  })

  const activeImgMap = computed(() =>
    activeImage.img.value !== undefined
      ? `${baseUrl}${activeImage.img.value}`
      : '',
  )
  const activeImgCmap = computed(() => `${baseUrl}${activeImage.cmap.value}`)
</script>

<style scoped>
  div {
    width: 480px;
    @media (max-width: 768px) {
      width: 420px;
    }
    @media (max-width: 640px) {
      width: 360px;
    }
  }
</style>
