<script setup>
import { reactive, ref } from 'vue'
import { httpClient } from '@/services/httpClient'
// optional: UserConfig / User-Daten reinziehen und als Default setzen

const form = reactive({
  name: '',
  email: '',
})

const errors = reactive({
  name: null,
  email: null,
})

const globalError = ref('')
const submitting = ref(false)

// Simple sync-Validation als Einstieg
function validate() {
  let valid = true

  errors.name = null
  errors.email = null
  globalError.value = ''

  if (!form.name.trim()) {
    errors.name = 'Bitte einen Namen angeben.' // später gern via $t
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Bitte eine E-Mail angeben.'
    valid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Bitte eine gültige E-Mail eingeben.'
    valid = false
  }

  return valid
}

async function onSubmit() {
  if (!validate()) return

  submitting.value = true
  globalError.value = ''

  try {
    await httpClient.put('/v1/user/settings', {
      name: form.name,
      email: form.email,
    })

    // Erfolg: Du könntest hier z. B. einen Toast zeigen oder UserConfig refreshen
  } catch (e) {
    globalError.value = e.message || 'Speichern fehlgeschlagen.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <h1>{{ $t('userSettings.title') }}</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <!-- Name -->
      <div class="form-group">
        <label for="name">{{ $t('userSettings.name') }}</label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            autocomplete="name"
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <!-- E-Mail -->
      <div class="form-group">
        <label for="email">{{ $t('userSettings.email') }}</label>
        <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <!-- Allgemeine Fehlermeldung -->
      <p v-if="globalError" class="error">{{ globalError }}</p>

      <!-- Buttons -->
      <button type="submit" :disabled="submitting">
        <span v-if="submitting">{{ $t('common.saving') }}</span>
        <span v-else>{{ $t('common.save') }}</span>
      </button>
    </form>
  </section>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.error {
  color: #b91c1c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>