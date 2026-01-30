<script setup lang="ts">
interface Props {
  img: string;
}

const props = defineProps<Props>()
</script>

<template>
  <div class="outer-container">
    <div class="inner-container">
      <img :src="`/icons/${img}`" alt="icon" />
    </div>
  </div>

</template>

<style scoped lang="scss">
img {
  width: 24px;
  height: 24px;
  opacity: 0.6;
  pointer-events: none;
}
.inner-container {
  padding: 12px;
  border-radius: 99px;
  background: $white-primary;
  border: 1px solid rgba($black-primary, 0.1);
  box-shadow: 0 4px 4px 0 rgba($black-primary, 0.05);
}
.outer-container {
  padding: 10px;
  border-radius: 99px;
  background: linear-gradient(180deg, rgba(92, 163, 255, 0.5) -100%, rgba(255, 255, 255, 1.0) 80%);
}
</style>
