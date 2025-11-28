<script setup>
import {useRoute} from 'vue-router'
import Navigation from "@/components/Navigation.vue";
import GlobalAlerts from "@/components/GlobalAlerts.vue";

const route = useRoute()
/*const { logout } = useAuth()*/

</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <Navigation />
      <!--      <nav>
        <RouterLink :to="{name: 'journal'}">$('journal.name')</RouterLink>
        &lt;!&ndash; weitere Links später z. B. /app/settings &ndash;&gt;
        <button @click="handleLogout">Logout</button>
      </nav>-->
    </header>

    <main class="app-main">
      <!-- Hier erscheinen die geschützten Views -->
      <div
        class="screen px-3 px-lg-5 py-2 d-block"
        :class="[{
          'screen-narrow': route.meta.isNarrow === true,
        }]"
      >
        <GlobalAlerts />
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>