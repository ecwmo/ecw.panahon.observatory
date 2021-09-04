<template>
  <div class="">
    <Navbar />
    <div id="main" class="d-flex py-5 px-4">
      <div id="sidebar" class="d-flex flex-column gap-2">
        <div>Map</div>
        <div class="d-flex justify-content-evenly mb-2">
          <button type="button" class="btn btn-light btn-xs rounded-pill">
            Min
          </button>
          <button type="button" class="btn btn-secondary btn-xs rounded-pill">
            Max
          </button>
        </div>
        <div class="d-flex flex-column gap-3">
          <Button
            v-for="w in weather"
            :key="w.name"
            @click="activeVariable = w.name"
            :class="[activeVariable === w.name ? 'btn-light' : 'btn-secondary']"
          >
            {{ w.title }}
          </Button>
        </div>
      </div>
      <div
        id="map"
        class="d-flex flex-column align-items-center"
        style="width: 400px"
      >
        <img alt="Map" src="./assets/map/wrf-wpd_mean.png" />
        <img
          alt="Colobar"
          src="./assets/map/cmap/wrf-wpd_cmap.png"
          style="height: 6%; width: 50%"
        />
      </div>
      <div id="info" class="d-flex flex-column align-items-start flex-grow-1">
        <span>3 Sept 2021</span>
        <span class="fs-3 mb-3">Clean Power | Weather Forecast</span>
        <div>
          <select class="form-select" aria-label="Default select example">
            <option selected>Ateneo de Manila University</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div class="w-100">
          <nav
            class="nav nav-pills justify-content-evenly mt-5 fs-5 border-bottom"
          >
            <a
              class="nav-link nav-btn-square bg-secondary active"
              aria-current="page"
              href="#"
              >Today</a
            >
            <a class="nav-link text-light" href="#">Tomorrow</a>
            <a class="nav-link text-light" href="#">Extended</a>
          </nav>
        </div>
        <div class="d-flex flex-column p-3 w-100 gap-3">
          <div class="d-flex justify-content-center gap-4 w-100">
            <WeatherCard
              v-for="w in cleanEnergyVars"
              :key="w.name"
              :title="variableTitle(w.title, w.units)"
              :data="w.data"
            />
          </div>
          <div class="d-flex justify-content-center gap-4 w-100">
            <WeatherCard
              v-for="w in weatherVars"
              :key="w.name"
              :title="variableTitle(w.title, w.units)"
              :data="w.data"
            />
          </div>
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #212529;
}

#main {
  background-color: #212529;
  color: #e9ecef;
}

.nav-pills .nav-link.nav-btn-square {
  border-radius: 0;
}

.weather-card {
  background-color: #495057;
}
</style>
