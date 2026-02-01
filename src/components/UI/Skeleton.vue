<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  borderRadius?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
  borderRadius: '8px',
})
</script>

<template>
  <div
    class="skeleton"
    :style="{
      width: width,
      height: height,
      borderRadius: borderRadius,
    }"
  />
</template>

<style scoped lang="scss">
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  display: inline-block;
  animation: skeleton-shimmer 2s linear infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>