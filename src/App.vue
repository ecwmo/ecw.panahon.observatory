<template>
  <div class="flex flex-col w-full h-screen select-none">
    <NavBar />
    <div class="w-full flex flex-col p-4 md:p-6 bg-gray-700 text-gray-200">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useQueryProvider } from 'vue-query'
  import NavBar from '@/components/NavBar.vue'

  export default defineComponent({
    components: {
      NavBar,
    },
    setup() {
      useQueryProvider()
    },
  })
</script>
