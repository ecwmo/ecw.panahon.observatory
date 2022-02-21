<template>
  <div class="w-32 flex flex-col gap-y-3 items-center">
    <div class="w-full h-5 flex gap-x-2 justify-evenly">
      <a
        v-for="(v, idx) in forecastImgVariants"
        :key="v"
        class="py-0.5 px-3 text-xs shadow-lg text-center rounded-full"
        href="#"
        :class="[
          activeImgType === idx
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        @click.prevent="$emit('setActiveImgType', idx)"
        >{{ v }}</a
      >
    </div>
    <div class="w-full flex flex-col gap-y-3">
      <a
        v-for="v in forecastVars"
        :key="v.name"
        class="w-full p-2 text-xs shadow-lg text-center"
        href="#"
        :class="[
          activeVariable === v.name
            ? 'text-gray-900 bg-gray-200 font-bold'
            : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
        ]"
        @click.prevent="$emit('setActiveVariable', v.name)"
      >
        {{ v.title }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs } from 'vue'
  import useForecastImg from '@/composables/useForecastImg'

  export default defineComponent({
    name: 'ForecastSidebar',
    props: {
      forecastVars: { type: Object, required: true },
      activeVariable: { type: String, required: true },
      activeImgType: { type: Number, required: true },
    },
    emits: ['setActiveVariable', 'setActiveImgType'],
    setup(props) {
      const { activeVariable } = toRefs(props)

      const { forecastImgVariants } = useForecastImg(activeVariable)

      return {
        forecastImgVariants,
      }
    },
  })
</script>
