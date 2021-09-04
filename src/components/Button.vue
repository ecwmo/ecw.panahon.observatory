<template>
  <button type="button" class="btn btn-square btn-sm">
    <slot></slot>
  </button>
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

<style scoped>
.btn.btn-xs {
  padding: 0.1rem 0.75rem;
  font-size: 0.75rem;
}

.btn.btn-square {
  border-radius: 0;
}
</style>
