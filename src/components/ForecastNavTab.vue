<template>
  <nav
    class="w-full flex justify-evenly text-xl md:text-2xl font-extralight border-b-2 mt-3 md:mt-6"
  >
    <a
      v-for="d in days"
      :key="d.label"
      class="py-2 px-4 text-center"
      href="#"
      :class="[
        activeDay.value === d.value
          ? 'bg-gray-500 font-bold'
          : 'hover:bg-gray-500',
      ]"
      @click.prevent="setActiveDay(d.value)"
      >{{ d.label }}</a
    >
  </nav>
</template>

<script lang="ts" setup>
  import { useStore } from '@nanostores/vue'

  import { days, setActiveDay, $activeDay } from '@/stores/forecast'

  const activeDay = useStore($activeDay)
</script>
