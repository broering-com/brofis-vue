<script setup>
import {computed} from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: false
  },
  label: {
    type: String,
    default: '' // i18n Key
  },
  id: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

function onChange(e) {
  if(e.target.checked) {
    const today = new Date()
    const h = today.getHours()
    const m = String(today.getMinutes()).padStart(2, '0')
    const s = String(today.getSeconds()).padStart(2, '0')
    console.log(`${h}:${m}:${s}`)
    emit('update:modelValue', `${h}:${m}:${s}`)
  } else {
    emit('update:modelValue', '')
  }
}

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => {
  return props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`
})
</script>

<template>

  <div class="form-check">
    <input
        class="form-check-input"
        :id="inputId"
        type="checkbox"
        :checked="modelValue.length > 0"
        @change="onChange"
        :class="{ 'is-invalid': error }"
    />

    <label class="form-check-label" :for="inputId">
      <!-- i18n-Label -->
      <span v-if="modelValue" class="badge bg-primary">{{modelValue}} {{$t('general.oclock')}}</span>
      {{ $t(label) }}
    </label>
  </div>
</template>
