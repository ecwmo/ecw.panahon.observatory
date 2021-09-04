<template>
  <a class="py-2 px-4 text-xs shadow-lg text-center" href="#">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: "Button",
  data: function () {
    return {
      isActive: false,
    };
  },
};
</script>
