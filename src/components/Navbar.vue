<template>
  <header>
    <!-- Navbar goes here -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
          <div class="flex space-x-7 justify-between w-full">
            <!-- Website Logo -->
            <div>
              <a href="#" class="flex items-center py-4 px-2">
                <img src="../assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
                <span class="font-semibold text-gray-900 text-lg"
                  >Manila Observatory</span
                >
              </a>
            </div>
            <!-- Primary Navbar items -->
            <div class="hidden md:flex items-center space-x-1">
              <a
                href="#"
                class="
                  py-4
                  px-2
                  text-gray-900
                  border-b-4 border-gray-900
                  font-semibold
                "
                >Weather</a
              >
              <a
                href="#"
                class="
                  py-4
                  px-2
                  text-gray-500
                  font-semibold
                  hover:text-blue-500
                  transition
                  duration-300
                "
                >About Us</a
              >
              <a
                href=""
                class="
                  py-4
                  px-2
                  text-gray-500
                  font-semibold
                  hover:text-blue-500
                  transition
                  duration-300
                "
                >Acknowledgements</a
              >
              <a
                href=""
                class="
                  py-4
                  px-2
                  text-gray-500
                  font-semibold
                  hover:text-blue-500
                  transition
                  duration-300
                "
                >Live Weather Data</a
              >
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Navbar",
};
</script>
