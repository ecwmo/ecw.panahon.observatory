<template>
  <select
    class="border bg-white rounded px-3 py-2 outline-none text-gray-900"
    :value="modelValue"
    @change="
      $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
    "
    data-test="select"
  >
    <option v-for="s in sites" :key="s.name" data-test="options">
      {{ s.name }}
    </option>
  </select>
</template>

<script lang="ts" setup generic="T extends Site">
  export type Site = {
    name: string
  }

  interface Props {
    sites?: T[]
    modelValue?: string
  }
  withDefaults(defineProps<Props>(), {
    sites: () => [{ name: '' }] as T[],
    modelValue: '',
  })

  interface Emits {
    (e: 'update:modelValue', value: string): void
  }
  defineEmits<Emits>()
</script>
