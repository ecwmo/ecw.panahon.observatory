<template>
  <select
    class="border bg-white rounded px-3 py-2 outline-none text-gray-900"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="fd in forecastData" :key="fd.name">
      {{ fd.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: "SiteDropDown",
  props: ["forecastData", "modelValue"],
  emits: ["update:modelValue"],
};
</script>
