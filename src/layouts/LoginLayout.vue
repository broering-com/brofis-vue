<script setup>

</script>

<template>
  <div class="login-layout">
    <main class="login-main">
      <!-- Hier kommen die Seiten rein, z. B. LoginView -->
      <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div
          class="card shadow-sm"
          style="max-width: 400px; width: 100%;"
        >
          <div class="card-body">
            <RouterView />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>