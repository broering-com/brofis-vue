<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '../services/authService'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''

  const result = await login(username.value, password.value)
  if(result.success) {
    router.push({name: 'dashboard'})
  } else {
    error.value = result.message || 'Login fehlgeschlagen'
  }
}
</script>

<template>
  <section>
    <h2>Login</h2>

    <form @submit.prevent="onSubmit">
      <p v-if="error" style="background-color: red; margin-top: 0.5rem; border-color: darkred; border-style: solid; border-radius: 0.5rem; padding: 0.5rem;">
        {{ error }}
      </p>
      <div>
        <label>Benutzername</label>
        <input v-model="username" placeholder="Benutzername"/>
      </div>
      <div>
        <label>Passwort</label>
        <input v-model="password" type="password" placeholder="Passwort"/>
      </div>
      <button type="submit">Login</button>
    </form>
  </section>
</template>

<style scoped>
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 1em;
}



</style>
