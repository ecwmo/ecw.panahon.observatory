<template>
  <header>
    <!-- Navbar goes here -->
    <nav
      class="flex flex-wrap justify-between items-center bg-white shadow-lg p-4"
    >
      <div class="flex items-center flex-no-shrink mr-6">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
        <span class="font-semibold text-gray-900 text-lg"
          >Manila Observatory</span
        >
      </div>
      <div class="flex md:hidden">
        <button
          @click="toggle"
          class="
            flex
            items-center
            px-3
            py-2
            border
            rounded
            hover:text-white hover:border-white hover:bg-black
          "
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div :class="open ? 'relative w-full' : 'hidden'" class="md:flex">
        <div
          class="
            flex flex-col flex-grow
            items-center
            md:flex-row md:justify-end
          "
          :class="open ? 'absolute right-0 bg-white shadow-lg' : ''"
        >
          <a
            v-for="(tab, i) in tabs"
            :key="tab.label"
            :href="tab.href"
            class="p-2 font-semibold"
            :class="[
              activeTab === i
                ? 'text-gray-900 border-b-4 border-gray-900'
                : 'text-gray-500 hover:text-blue-500 transition duration-300',
            ]"
            >{{ tab.label }}</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Navbar",
  setup() {
    const open = ref(false);
    const activeTab = ref(0);

    const tabs = [
      { label: "Weather", href: "/" },
      { label: "About Us", href: "#" },
      { label: "Acknowledgements", href: "#" },
      { label: "Live Weather Data", href: "https://panahon.observatory.ph" },
    ];

    const toggle = () => (open.value = !open.value);

    return { tabs, activeTab, open, toggle };
  },
};
</script>
