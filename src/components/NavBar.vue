<template>
  <header>
    <!-- Navbar goes here -->
    <nav
      class="flex flex-wrap justify-between items-center bg-white shadow-lg px-2 md:px-6 py-2"
    >
      <div class="flex items-center flex-no-shrink mr-6">
        <img :src="logo.src" alt="Logo" class="h-8 w-8 md:h-10 md:w-10 mr-2" />
        <span class="font-semibold text-gray-900 text-lg md:text-2xl"
          >Manila Observatory</span
        >
      </div>
      <div class="flex md:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded hover:text-white hover:border-white hover:bg-black"
          @click="toggle"
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
          class="flex flex-col flex-grow items-center md:flex-row md:justify-end"
          :class="open ? 'absolute right-0 bg-white shadow-lg' : ''"
        >
          <a
            v-for="tab in tabs"
            :key="tab.label"
            :href="tab.href"
            class="p-2 font-semibold text-gray-500 hover:text-blue-500 transition duration-300"
            @click="open = false"
            >{{ tab.label }}</a
          >
          <a
            v-for="tab in tabs2"
            :key="tab.label"
            :href="tab.href"
            class="p-2 font-semibold text-gray-500 hover:text-blue-500 transition duration-300"
            >{{ tab.label }}</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import logo from '@/assets/logo.png'

  const open = ref(false)

  const tabs = [
    { label: 'Power • Weather', href: '/' },
    { label: 'Acknowledgements', href: '/acknowledgements' },
  ]

  const tabs2 = [
    { label: 'Station Data', href: 'https://panahon.observatory.ph' },
  ]

  const toggle = () => (open.value = !open.value)
</script>

<style scoped>
  .router-link-active {
    --at-apply: text-gray-900 border-b-2 border-gray-900;
  }
</style>
