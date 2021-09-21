<template>
  <div class="flex flex-col w-full h-screen">
    <Navbar />
    <div class="w-full flex flex-col p-4 md:p-6 bg-gray-700 text-gray-200">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useQueryProvider } from "vue-query";
import Navbar from "@/components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
  setup() {
    useQueryProvider();
  },
};
</script>
