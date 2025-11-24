<script setup>
import GlobalLoadingSpinner from "@/components/GlobalLoadingSpinner.vue";
import {onMounted, watch} from "vue";
import {useUserConfig} from "@/services/userConfigService.js";
import {useI18n} from "@/services/i18nService.js";

onMounted(() => {
  const {loadMessages} = useI18n()
  const {userConfig} = useUserConfig()
  const lang = userConfig.value?.language || 'de'
  loadMessages(lang)

  watch(
      () => userConfig.value?.language,
      (newLang, oldLang) => {
        if (!newLang || newLang === oldLang) return
        loadMessages(newLang)
      }
  )
})
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
