<template>
  <nav
    class="w-full flex justify-evenly text-xl md:text-2xl font-extralight border-b-2 mt-3 md:mt-6"
  >
    <a
      v-for="tab in tabs"
      :key="tab.label"
      class="py-2 px-4 text-center"
      href="#"
      :class="[
        activeDay === tab.value ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
      ]"
      @click.prevent="$emit('setActiveDay', tab.value)"
      >{{ tab.label }}</a
    >
  </nav>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'ForecastNavTab',
    props: { activeDay: { type: Number, required: true } },
    emits: ['setActiveDay'],
    setup() {
      const tabs = [
        { label: 'Today', value: 0 },
        { label: 'Tomorrow', value: 1 },
        { label: 'Extended', value: 4 },
      ]

      return { tabs }
    },
  })
</script>
