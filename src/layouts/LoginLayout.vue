<script setup>

</script>

<template>
  <div class="login-layout">
    <main class="login-main">
      <!-- Hier kommen die Seiten rein, z. B. LoginView -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.login-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-main {
  background: white;
  color: black;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  min-width: 320px;
  max-width: 400px;
}
</style>