<script setup>

import GlobalLoadingSpinner from "@/components/GlobalLoadingSpinner.vue";
</script>

<template>
  <RouterView />

  <!-- global spinner -->
  <GlobalLoadingSpinner />
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
