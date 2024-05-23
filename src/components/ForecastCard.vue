<template>
  <a
    href="#"
    class="flex items-center p-3 md:p-4 w-56 h-32 md:w-60 cursor-default"
    @click.prevent
    data-test="card"
  >
    <div class="w-1/5 flex justify-center" data-test="card-icon">
      <img :src="icon.src" :class="[name === 'temp' ? 'w-3/4' : '']" />
    </div>
    <div class="w-4/5 flex-grow flex flex-col items-center">
      <span data-test="card-title">{{ title }}</span>
      <div
        v-for="d in data"
        :key="d.name"
        class="flex items-end gap-2"
        data-test="card-body"
      >
        <div class="textxs md:text-sm pb-1">{{ d.name }}</div>
        <div class="text-3xl md:text-4xl font-bold uppercase">
          {{ d.value }}
        </div>
      </div>
    </div>
  </a>
</template>

<script lang="ts" setup>
  import type { ForecastCardInfo } from '@/composables/useForecastCardData'

  defineProps<ForecastCardInfo>()
</script>
