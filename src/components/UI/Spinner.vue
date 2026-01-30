<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium'
  color?: 'dark' | 'white'
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'dark'
})

const computeBorder = computed(() => {
  if (props.size === 'small') {
    if (props.color === 'white') {
      return '3px solid rgba(white, 0.1)'
    }
    else if (props.color === 'dark') {
      return '3px solid rgba(black, 0.1)'
    }
  }
})

const computeBorderTop = computed(() => {
  if (props.size === 'small') {
    if (props.color === 'white') {
      return '3px solid white'
    }
    if (props.color === 'dark') {
      return '3px solid black'
    }
  }
})
</script>

<template>
  <div class="loading-screen" :class="size">
    <div class="spinner" :style="{
      border: computeBorder,
      borderTop: computeBorderTop,
    }"></div>
  </div>
</template>

<style scoped lang="scss">
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;

  &.medium {
    width: 100%;
    height: 300px;
    & > .spinner {
      width: 35px;
      height: 35px;
      border: 5px solid rgba(black, 0.1);
      border-top: 5px solid var(--text-primary);
    }
  }
  &.small{
    height: 16px !important;

    & > .spinner {
      width: 16px;
      height: 16px;
      border: 3px solid rgba($white-primary, 0.1);
      border-top: 3px solid $white-primary;
    }
  }
}
.spinner {
  border-radius: 100%;
  animation: spin 700ms linear infinite;
  margin: 0 auto;
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