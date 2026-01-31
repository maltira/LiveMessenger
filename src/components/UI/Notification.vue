<script setup lang="ts">
import { useNotification } from '@/composables/useNotifications.ts'

const { notifications, hideNotification } = useNotification()
</script>

<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        class="notification"
        v-for="notification in notifications"
        v-show="notification.show"
        :key="notification.id"
        :class="{ 'notification-enter': notification.visible }"
        @click="hideNotification(notification.id)"
      >
        <p class="desc">{{ notification.description }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.notification-container {
  position: fixed;
  bottom: 30px;
  right: 50px;
  z-index: 9999;
}

.notification {
  max-width: 500px;
  border-radius: 32px;
  background: white;
  border: 1px solid $gray-primary;
  padding: 8px 32px;
  margin-bottom: 10px;
  box-shadow: -4px 6px 32px 0 rgba(black, 0.06);

  cursor: pointer;

  // Начальное состояние - скрыто и уменьшено
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  transform-origin: bottom right;

  // Анимация появления
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  // Активное состояние
  &.notification-enter {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

// Анимация для удаляемого элемента (TransitionGroup)
.notification-leave-active {
  transition: all 0.25s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.notification-leave-to {
  opacity: 0;
  transform: scale(0.7) translateX(100px);
  transform-origin: bottom right;
}

// Эффект при наведении
.notification:hover {
  transform: scale(1.02) translateY(0);
  box-shadow: -4px 6px 40px 0 rgba(black, 0.12);
}

.desc {
  @include tag-text();
  opacity: 0.9;
}
</style>