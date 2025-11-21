<!-- src/components/GlobalLoadingSpinner.vue -->
<script setup>
import { useHttpLoading } from '@/services/httpClient'

const { isHttpLoading } = useHttpLoading()
</script>

<template>
  <div v-if="isHttpLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* simple CSS-Spinner */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #ccc;
  border-top-color: #3b82f6; /* blau */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
