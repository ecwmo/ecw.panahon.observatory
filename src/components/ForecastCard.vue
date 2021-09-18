<template>
  <a href="#" class="flex items-center p-3 md:p-4 w-56 md:w-60" @click.prevent>
    <div class="w-1/4 flex justify-center">
      <img :src="icon" class="w-10 md:w-14" />
    </div>
    <div class="flex-grow flex flex-col items-center">
      <span>{{ title }}</span>
      <div class="flex items-end gap-2" v-for="d in data" v-bind:key="d.name">
        <div class="textxs md:text-sm pb-1">{{ d.name }}</div>
        <div class="text-3xl md:text-4xl font-bold uppercase">
          {{ d.value }}
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: "ForecastCard",
  props: ["title", "data", "icon"],
};
</script>
