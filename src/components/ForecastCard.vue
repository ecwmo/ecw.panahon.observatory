<template>
  <a
    href="#"
    class="flex items-center p-3 md:p-4 w-56 h-32 md:w-60"
    @click.prevent
  >
    <div class="w-1/5 flex justify-center">
      <img :src="icon" :class="[name === 'temp' ? 'w-3/4' : '']" />
    </div>
    <div class="w-4/5 flex-grow flex flex-col items-center">
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
  props: ["name", "title", "data", "icon"],
};
</script>
