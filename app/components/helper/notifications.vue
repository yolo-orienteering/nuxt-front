<script setup lang="ts">
  import { useNotify } from '@/stores/useNotify'
  const notifications = useNotify()
</script>

<template>
  <div class="notifications-container">
    <div
      v-for="(notification, notificationId) in notifications.notifications"
      :key="notificationId"
      class="mt-3"
    >
      <v-alert
        :type="notification.type"
        position="relative"
        closable
        close-icon="mdi mdi-close text-white mdi-24px"
      >
        {{ notification.text }}
      </v-alert>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $notification-width: 350px;

  .notifications-container {
    position: absolute;
    top: 88px;
    width: $notification-width;
    left: calc(50vw - ($notification-width / 2));
    z-index: 999999;
  }
</style>
