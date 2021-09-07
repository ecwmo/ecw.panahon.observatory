<template>
  <Navbar />
  <div id="main" class="flex py-8 px-4 bg-gray-700 text-gray-200">
    <div id="sidebar" class="flex flex-col space-y-4 items-center w-1/12">
      <span class="text-xl font-bold">Map</span>
      <div class="flex space-x-2 mb-2">
        <a
          class="py-0.5 px-3 text-xs shadow-lg text-center rounded-full"
          href="#"
          v-for="(v, idx) in forecastImgVariants"
          :key="v"
          @click="activeImgType = idx"
          :class="[
            activeImgType === idx
              ? 'text-gray-900 bg-gray-200 font-bold'
              : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
          ]"
          >{{ v }}</a
        >
      </div>
      <div class="flex flex-col space-y-3">
        <a
          class="py-2 px-4 text-xs shadow-lg text-center"
          href="#"
          v-for="v in forecastVars"
          :key="v.name"
          @click="activeVariable = v.name"
          :class="[
            activeVariable === v.name
              ? 'text-gray-900 bg-gray-200 font-bold'
              : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
          ]"
        >
          {{ v.title }}
        </a>
      </div>
    </div>
    <div id="map" class="flex flex-col" style="width: 400px">
      <img alt="Map" :src="forecastImg" class="transform scale-100" />
      <img alt="Colobar" :src="forecastImgCmap" class="transform scale-50" />
    </div>
    <div id="info" class="flex flex-col items-start">
      <span class="text-sm font-extralight">{{ dateString }}</span>
      <span class="text-3xl mb-3">Clean Power | Weather Forecast</span>
      <div>
        <select
          class="
            w-full
            border
            bg-white
            rounded
            px-3
            py-2
            outline-none
            text-gray-900
          "
          v-model="activeSite"
        >
          <option v-for="fd in forecastData" :key="fd.name">
            {{ fd.name }}
          </option>
        </select>
      </div>
      <div class="w-full">
        <nav
          class="text-2xl font-extralight border-b-2 mt-6 flex justify-evenly"
        >
          <a
            class="py-2 px-4 text-center"
            href="#"
            @click="activeDay = 0"
            :class="[
              activeDay === 0 ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
            ]"
            >Today</a
          >
          <a
            class="py-2 px-4 text-center"
            href="#"
            @click="activeDay = 1"
            :class="[
              activeDay === 1 ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
            ]"
            >Tomorrow</a
          >
          <a
            class="py-2 px-4 text-center"
            href="#"
            @click="activeDay = 4"
            :class="[
              activeDay === 4 ? 'bg-gray-500 font-bold' : 'hover:bg-gray-500',
            ]"
            >Extended</a
          >
        </nav>
      </div>
      <div class="flex flex-col p-6 space-y-6">
        <div class="flex justify-center space-x-6">
          <WeatherCard
            v-for="w in cleanEnergyData"
            :key="w.name"
            :title="variableTitle(w.title, w.units)"
            :data="w.data"
            @click="activeVariable = w.name"
            :class="[
              activeVariable === w.name
                ? 'text-white bg-gray-400'
                : 'text-gray-200 bg-gray-600 hover:bg-gray-200 hover:text-gray-600',
            ]"
          />
        </div>
        <div class="flex justify-center space-x-6">
          <WeatherCard
            v-for="w in weatherData"
            :key="w.name"
            :title="variableTitle(w.title, w.units)"
            :data="w.data"
            @click="activeVariable = w.name"
            :class="[
              activeVariable === w.name
                ? 'text-white bg-gray-400'
                : 'text-gray-200 bg-gray-600 hover:bg-gray-200 hover:text-gray-600',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { format } from "date-fns";
import Navbar from "./components/Navbar.vue";
import WeatherCard from "./components/WeatherCard.vue";

export default {
  name: "App",
  components: {
    Navbar,
    WeatherCard,
  },
  data: function () {
    return {
      activeSite: "NCR",
      activeDay: 0,
      activeVariable: "wpd",
      activeImgType: 0,
      timestamp: Date.now(),
      forecastData: [],
      forecastVars: [
        {
          name: "wpd",
          units: "MW",
          title: "WIND POWER",
        },
        {
          name: "ppv",
          units: "MW",
          title: "SOLAR POWER",
        },
        {
          name: "temp",
          units: "°C",
          title: "TEMPERATURE",
        },
        {
          name: "wind",
          units: "kph",
          title: "WIND SPEED",
        },
        {
          name: "rainchance",
          title: "RAIN CHANCE",
        },
      ],
    };
  },
  computed: {
    dateString() {
      return format(this.timestamp, "d MMM yyyy");
    },
    cleanEnergyData() {
      let data = this.forecastData.filter((d) => d.name === this.activeSite);
      if (data.length > 0) {
        data = data[0].forecast[this.activeDay];
        return [
          {
            name: "wpd",
            units: "MW",
            title: "WIND POWER",
            data: [
              { name: "Ave", value: data.wndPow.toFixed(1) },
              { name: "Max", value: data.wndPowMax.toFixed(1) },
            ],
          },
          {
            name: "ppv",
            units: "MW",
            title: "SOLAR POWER",
            data: [
              { name: "Ave", value: data.solPow.toFixed(1) },
              { name: "Max", value: data.solPowMax.toFixed(1) },
            ],
          },
        ];
      }

      return [];
    },
    weatherData() {
      let data = this.forecastData.filter((d) => d.name === this.activeSite);
      if (data.length > 0) {
        data = data[0].forecast[this.activeDay];
        return [
          {
            name: "temp",
            units: "°C",
            title: "TEMPERATURE",
            data: [
              { name: "Min", value: data.tempMin.toFixed(1) },
              { name: "Max", value: data.tempMax.toFixed(1) },
            ],
          },
          {
            name: "wind",
            units: "kph",
            title: "WIND SPEED",
            data: [
              { name: "Min", value: data.wspdMin.toFixed(1) },
              { name: "Max", value: data.wspdMax.toFixed(1) },
            ],
          },
          {
            name: "rainchance",
            title: "RAIN CHANCE",
            data: [{ value: data.rainChance }],
          },
        ];
      }
      return [];
    },
    forecastImgVariants() {
      if (["wpd", "ppv"].indexOf(this.activeVariable) !== -1)
        return ["Ave", "Max"];
      else if (this.activeVariable === "rainchance") return [];
      else return ["Min", "Max"];
    },
    forecastImg() {
      let imgTypes = ["min", "max"];
      if (["wpd", "ppv"].indexOf(this.activeVariable) !== -1)
        imgTypes = ["mean", "max"];
      else if (this.activeVariable === "rainchance") imgTypes = "";

      if (imgTypes === "")
        return `https://panahon.observatory.ph/resources/model/web_img/wrf-${this.activeVariable}_latest.png`;
      return `https://panahon.observatory.ph/resources/model/web_img/wrf-${
        this.activeVariable
      }_${imgTypes[this.activeImgType]}_latest.png`;
    },
    forecastImgCmap() {
      return `https://panahon.observatory.ph/resources/model/web_img/cmap/wrf-${this.activeVariable}_cmap.png`;
    },
  },
  methods: {
    variableTitle(title, units = "") {
      if (units !== "") return `${title} (${units})`;
      return title;
    },
    async fetchForecast() {
      try {
        const url = "https://panahon.observatory.ph/api/forecast.php";
        const forecastData = await axios.get(url).then(({ data }) => data);
        this.forecastData = Object.keys(forecastData).map(
          (k) => forecastData[k]
        );
        this.timestamp = new Date(this.forecastData[0].forecast[0].timestamp);
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err);
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err);
        } else {
          console.log("Client Error:", err);
        }
      }
    },
  },
  mounted() {
    this.fetchForecast();
  },
};
</script>
