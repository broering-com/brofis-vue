<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../services/authService'

const router = useRouter()
const { logout } = useAuth()

function handleLogout() {
  logout()
  router.push({name: 'login'})
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>Meine App</h1>

      <nav>
        <RouterLink :to="{name: 'dashboard'}">Dashboard</RouterLink>
        <RouterLink :to="{name: 'userSettings'}">User Settings</RouterLink>
        <!-- weitere Links später z. B. /app/settings -->
        <button @click="handleLogout">Logout</button>
      </nav>
    </header>

    <main class="app-main">
      <!-- Hier erscheinen die geschützten Views -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.app-header nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.app-main {
  padding: 1.5rem;
}

a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>