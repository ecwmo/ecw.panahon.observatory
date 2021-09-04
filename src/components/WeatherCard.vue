<template>
  <div class="weather-card d-flex align-items-center py-2" style="width: 16rem">
    <div class="w-25">Icon</div>
    <div class="w-75 d-flex flex-column align-items-center">
      <div>{{ title }}</div>
      <!-- <div class="d-flex align-items-end gap-2">
        <div class="pb-2">Ave</div>
        <div class="fs-1">5.4</div>
      </div>
      <div class="d-flex align-items-end gap-2">
        <div class="pb-2">Max</div>
        <div class="fs-1">8.3</div>
      </div> -->
      <div
        class="d-flex align-items-end gap-2"
        v-for="d in data"
        v-bind:key="d.name"
      >
        <div class="pb-2">{{ d.name }}</div>
        <div class="fs-1">{{ d.value }}</div>
      </div>
    </div>
  </div>
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
}
</style>
