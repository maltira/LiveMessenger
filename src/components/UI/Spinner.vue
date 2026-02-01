<script setup lang="ts">

interface Props {
  size?: 'small' | 'medium'
  color?: 'dark' | 'white'
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'dark'
})

</script>

<template>
  <div class="spinner" :class="[size, color]"></div>
</template>

<style scoped lang="scss">
.spinner {
  border-radius: 100%;
  animation: spin 700ms linear infinite;

  width: 35px;
  height: 35px;
  border: 5px solid rgba($white-primary, 0.1);
  border-top: 5px solid $white-primary;

  &.small{
    width: 16px;
    height: 16px;
    border: 3px solid rgba($white-primary, 0.2);
    border-top: 3px solid $white-primary;
  }

  &.dark {
    border-color: rgba($black-primary, 0.1);
    border-top-color: rgba($black-primary, 0.6);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>