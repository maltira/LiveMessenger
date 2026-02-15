<script setup lang="ts">
</script>

<template>
  <div class="not-found-view">
    <div class="text-info">
      <h4>Упсс... не найдено</h4>
      <p>К сожалению, эта страница не найдена</p>
    </div>
    <button>На главную</button>
  </div>
</template>

<style scoped lang="scss">
.not-found-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;

  & > .text-info {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > h4 {
      @include h4-text;
      text-align: center;
    }
    & > p {
      @include input-text;
      text-align: center;
    }
  }

  & > button {
    @include inline-btn;
    width: 300px;
  }
}
</style>
