<!-- src/components/layout/GlobalAlerts.vue -->
<script setup>
import { useNotifications } from '@/services/notificationService'
import Alert from '@/components/utils/Alert.vue'

const { notifications, removeNotification } = useNotifications()
</script>

<template>
  <div class="global-alerts mt-3">
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
  </div>
</template>
