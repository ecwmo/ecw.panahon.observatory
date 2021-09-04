<template>
  <a
    href="#"
    class="weather-card btn d-flex align-items-center py-2"
    style="width: 16rem"
  >
    <div class="w-25">Icon</div>
    <div class="w-75 d-flex flex-column align-items-center">
      <div>{{ title }}</div>
      <div
        class="d-flex align-items-end gap-2"
        v-for="d in data"
        v-bind:key="d.name"
      >
        <div class="pb-2">{{ d.name }}</div>
        <div class="fs-1">{{ d.value }}</div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: "WeatherCard",
  props: ["title", "data"],
};
</script>

<style scoped>
.weather-card {
  background-color: #495057;
  color: #e9ecef;
  border-radius: 0;
}
</style>
