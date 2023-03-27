<template>
  <div class="flex flex-col w-full h-screen select-none">
    <NavBar />
    <div class="w-full flex flex-col p-4 md:p-6 bg-gray-700 text-gray-200">
      <router-view />
    </div>
  </div>
</template>
