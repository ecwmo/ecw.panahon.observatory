<template>
  <select
    class="border bg-white rounded px-3 py-2 outline-none text-gray-900"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    data-test="select"
  >
    <option v-for="s in sites" :key="s.name" data-test="options">
      {{ s.name }}
    </option>
  </select>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'

  interface Site {
    name: string
  }

  defineProps({
    sites: { type: Object as PropType<Site[]>, default: [{ name: '' }] },
    modelValue: { type: String, default: '' },
  })

  defineEmits(['update:modelValue'])
</script>
