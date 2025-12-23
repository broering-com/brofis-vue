<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  id: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

function makeTimestamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const inputId = computed(
  () => props.id || `badge-checkbox-${Math.random().toString(36).slice(2, 9)}`
);

const checked = computed({
  get: () => (props.modelValue || "").length > 0,
  set: (isChecked) => {
    if (isChecked) {
      emit("update:modelValue", makeTimestamp());
    } else {
      emit("update:modelValue", "");
    }
  },
});
</script>

<template>
  <div class="form-check">
    <input
      :id="inputId"
      v-model="checked"
      class="form-check-input"
      type="checkbox"
    >

    <label
      class="form-check-label"
      :for="inputId"
    >
      <span
        v-if="props.modelValue"
        class="badge bg-primary me-2"
      >
        {{ props.modelValue }} {{ $t('general.oclock') }}
      </span>

      {{ $t(props.label) }}
    </label>
  </div>
</template>
