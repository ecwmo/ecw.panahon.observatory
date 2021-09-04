<template>
  <Navbar />
  <div id="main" class="flex py-8 px-4 bg-gray-700 text-gray-200">
    <div id="sidebar" class="flex flex-col space-y-4 items-center">
      <span class="text-xl font-bold">Map</span>
      <!-- <div class="flex justify-evenly mb-2">
        <button type="button" class="btn btn-light btn-xs rounded-pill">
          Min
        </button>
        <button type="button" class="btn btn-secondary btn-xs rounded-pill">
          Max
        </button>
      </div> -->
      <div class="flex flex-col space-y-3">
        <Button
          v-for="w in weather"
          :key="w.name"
          @click="activeVariable = w.name"
          :class="[
            activeVariable === w.name
              ? 'text-gray-900 bg-gray-200 font-bold'
              : 'text-gray-200 bg-gray-500 hover:bg-gray-200 hover:text-gray-500',
          ]"
        >
          {{ w.title }}
        </Button>
      </div>
    </div>
    <div id="map" class="flex flex-col" style="width: 400px">
      <img
        alt="Map"
        src="./assets/map/wrf-wpd_mean.png"
        class="transform scale-100"
      />
      <img
        alt="Colobar"
        src="./assets/map/cmap/wrf-wpd_cmap.png"
        class="transform scale-50"
      />
    </div>
    <div id="info" class="flex flex-col items-start">
      <span class="text-sm font-extralight">3 Sept 2021</span>
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
        >
          <option selected>Ateneo de Manila University</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="w-full">
        <nav
          class="text-2xl font-extralight border-b-2 mt-6 flex justify-evenly"
        >
          <a class="nav-link nav-btn-square bg-secondary active" href="#"
            >Today</a
          >
          <a class="nav-link text-light" href="#">Tomorrow</a>
          <a class="nav-link text-light" href="#">Extended</a>
        </nav>
      </div>
      <div class="flex flex-col p-6 space-y-6">
        <div class="flex justify-center space-x-6">
          <WeatherCard
            v-for="w in cleanEnergyVars"
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
            v-for="w in weatherVars"
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
import Navbar from "./components/Navbar.vue";
import Button from "./components/Button.vue";
import WeatherCard from "./components/WeatherCard.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Button,
    WeatherCard,
  },
  data: function () {
    return {
      activeVariable: "wpd",
      weather: [
        {
          name: "wpd",
          units: "MW",
          title: "WIND POWER",
          data: [
            { name: "Ave", value: 5.4 },
            { name: "Max", value: 8.3 },
          ],
        },
        {
          name: "ppv",
          units: "MW",
          title: "SOLAR POWER",
          data: [
            { name: "Ave", value: 2.3 },
            { name: "Max", value: 8.3 },
          ],
        },
        {
          name: "temp",
          units: "°C",
          title: "TEMPERATURE",
          data: [
            { name: "Min", value: 28 },
            { name: "Max", value: 37 },
          ],
        },
        {
          name: "wind",
          units: "kph",
          title: "WIND SPEED",
          data: [
            { name: "Min", value: 3 },
            { name: "Max", value: 14 },
          ],
        },
        {
          name: "rainchance",
          title: "RAIN CHANCE",
          data: [{ value: "LOW" }],
        },
      ],
    };
  },
  computed: {
    cleanEnergyVars() {
      return this.weather.filter(
        ({ name }) => ["wpd", "ppv"].indexOf(name) !== -1
      );
    },
    weatherVars() {
      return this.weather.filter(
        ({ name }) => ["wpd", "ppv"].indexOf(name) === -1
      );
    },
  },
  methods: {
    variableTitle(title, units = "") {
      if (units !== "") return `${title} (${units})`;
      return title;
    },
  },
};
</script>
