<template>
  <table class="text-xs">
    <tr class="text-lg uppercase">
      <th></th>
      <th v-for="(dat, idx) in data" :key="idx" class="p-3">{{ dat.title }}</th>
    </tr>
    <tr>
      <td>
        <table>
          <tr class="bg-black">
            <th class="py-2 px-3 text-black">NAME</th>
          </tr>
          <tr class="bg-green-300 bg-opacity-25">
            <td class="py-2 px-3">Wind Energy</td>
          </tr>
          <tr class="bg-yellow-400 bg-opacity-25">
            <td class="py-2 px-3">Solar Energy</td>
          </tr>
          <tr class="bg-red-600 bg-opacity-25">
            <td class="py-2 px-3">Temperature</td>
          </tr>
          <tr class="bg-blue-200 bg-opacity-25">
            <td class="py-2 px-3">Wind</td>
          </tr>
          <tr class="bg-blue-700 bg-opacity-25">
            <td class="py-2 px-3">Rain</td>
          </tr>
        </table>
      </td>
      <td v-for="(dat, idx) in data" :key="idx">
        <table class="text-center">
          <tr class="bg-black">
            <th class="py-2 px-3">MIN</th>
            <th class="py-2 px-3">MAX</th>
            <th class="py-2 px-3">AVE</th>
          </tr>
          <tr v-for="(d, idx2) in dat.values" :key="`${idx}_${idx2}`">
            <td
              v-for="(dd, idx3) in d"
              :key="`${idx}_${idx2}_${idx3}`"
              class="py-2 px-3"
              :class="{
                'bg-green-300 bg-opacity-25': idx2 === 0,
                'bg-yellow-400 bg-opacity-25': idx2 === 1,
                'bg-red-600 bg-opacity-25': idx2 === 2,
                'bg-blue-200 bg-opacity-25': idx2 === 3,
                'bg-blue-700 bg-opacity-25': idx2 === 4,
              }"
            >
              {{ dd }}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "ForecastTable",
  props: ["data"],
};
</script>
