<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => [] // z.B. [{ value: 'stall1', label: 'Stall 1' }]
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => {
  // Falls kein id übergeben wird, automatisch generieren
  return props.id || `input-${Math.random().toString(36).substring(2, 9)}`
})

// Proxy für v-model
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="mb-3">
    <label
      v-if="label"
      id="{{ inputId }}-label"
      class="form-label pb-0 ps-0 mb-0 w-100 col-12 d-flex justify-content-between"
      :class="{ 'invisible' : !showLabel }"
      :for="inputId"
    >
      {{ $t ? $t(label) : label }}
    </label>

    <select
      :id="inputId"
      v-model="innerValue"
      class="form-select"
      :disabled="disabled"
      :aria-labelledby="inputId + '-label'"
      :aria-invalid="!!error"
      :aria-describedby="error ? inputId + '-error' : null"
      :required="required"
    >
      <option
        v-for="opt in options"
        :key="opt.value ?? opt"
        :value="opt.value ?? opt"
      >
        <!-- falls du i18n-Keys als Label nutzt -->
        {{ $t && opt.label ? $t(opt.label) : (opt.label ?? opt) }}
      </option>
    </select>
  </div>
</template>
