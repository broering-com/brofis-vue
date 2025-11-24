<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuth} from '../services/authService'
import Alert from "@/components/utils/Alert.vue";

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
    <img src="@/assets/logo.png" class="mx-auto d-block mb-4" alt="Logo" style="height: 48px;"/>
    <alert type="info">{{ $t('login.subtitle') }}</alert>

    <h2 class="sr-only">{{ $t('login.title') }}</h2>

    <form @submit.prevent="onSubmit">
      <p v-if="error" style="background-color: red; margin-top: 0.5rem; border-color: darkred; border-style: solid; border-radius: 0.5rem; padding: 0.5rem;">
        {{ error }}
      </p>
      <div>
        <label class="form-control-label pb-0 ps-0" for="login-username">{{ $t('general.username') }}</label>
        <input v-model="username" for="login-username" class="form-control" :placeholder="$t('general.username')"/>
      </div>
      <div class="mb-2">
        <label class="form-control-label pb-0 ps-0" for="login-password">{{ $t('general.password') }}</label>
        <input v-model="password" id="login-password" type="password" class="form-control" :placeholder="$t('general.password')"/>
      </div>
      <div class="form-check mb-3">
        <input type="checkbox" class="form-check-input" id="rememberMe" />
        <label for="rememberMe" class="form-check-label">
          {{$t('login.remember_me')}}
        </label>
      </div>
      <button class="btn btn-primary w-100" type="submit" :disabled="!username || !password">{{ $t('login.button_label') }}</button>
    </form>
  </section>
</template>

<style scoped>

</style>
