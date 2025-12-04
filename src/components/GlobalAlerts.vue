<!-- src/components/layout/GlobalAlerts.vue -->
<script setup>
import { useNotifications } from '@/services/notificationService'
import Alert from '@/components/utils/Alert.vue'

const { notifications, removeNotification } = useNotifications()
</script>

<template>
  <div class="global-alerts mt-3">
    <TransitionGroup
      name="alert"
      tag="div"
      class="global-alerts-inner"
    >
      <div
        v-for="n in notifications"
        :key="n.id"
        class="mb-2"
      >
        <Alert :type="n.type">
          <div class="d-flex justify-content-between align-items-center">
            <span>{{ $t(n.message) }}</span>
            <button
              type="button"
              class="btn-close ms-3"
              aria-label="Close"
              @click="removeNotification(n.id)"
            />
          </div>
        </Alert>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Enter + Leave Animation */
.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.alert-enter-to,
.alert-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Optional: beim Entfernen leicht schrumpfen */
.alert-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>