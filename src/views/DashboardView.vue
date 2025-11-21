<script setup>
import {useRouter} from 'vue-router'
import {useUserConfig} from '@/services/userConfigService'
import {watch} from "vue";

const router = useRouter()
const {userConfig, isUserConfigLoading, userConfigError} = useUserConfig()
if (!userConfig.value) {
  useUserConfig().refreshUserConfig()
}

watch(userConfig,
    (newUserConfig, oldUserConfig) => {
      console.log('UserConfig geändert:', newUserConfig, oldUserConfig)
    },
    {deep: true})

function logout() {
  localStorage.removeItem('auth')
  router.push('/')
}


</script>

<template>
  <section>
    <h1>Dashboard</h1>
    <p>Du bist eingeloggt 🎉</p>
    <p v-if="isUserConfigLoading">Lade User-Konfiguration...</p>
    <p v-else-if="userConfigError" style="color: red;">
      Fehler beim Laden der UserConfig: {{ userConfigError.message }}
    </p>
    <pre v-else>{{ userConfig }}</pre>

  </section>
</template>

<style scoped>

</style>