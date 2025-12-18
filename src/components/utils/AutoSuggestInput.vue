<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  displayKey: {
    type: String,
    default: "label",
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

// 🔹 eigener interner Input-Text, entkoppelt von props.modelValue
const inputValue = ref(props.modelValue ?? "");

// wenn sich das v-model von außen ändert, spiegeln wir es rein
watch(
    () => props.modelValue,
    (val) => {
      inputValue.value = val ?? "";
    }
);

// 🔑 Hilfsfunktion: Label einer Option holen (String oder Objekt)
function getOptionLabel(option) {
  if (typeof option === "string") {
    return option;
  }
  return option?.[props.displayKey] ?? "";
}

const isOpen = ref(false);
const highlightedIndex = ref(-1);

const filteredOptions = computed(() => {
  const term = (inputValue.value ?? "").toString().toLowerCase().trim();
  if (!term) return props.options;

  return props.options.filter((opt) =>
      getOptionLabel(opt).toLowerCase().includes(term)
  );
});

function onFocus() {
  if (filteredOptions.value.length > 0) {
    isOpen.value = true;
  }
}

function onInput(event) {
  inputValue.value = event.target.value;
  emit("update:modelValue", inputValue.value);
  highlightedIndex.value = -1;
  isOpen.value = filteredOptions.value.length > 0;
}

function selectOption(option) {
  const label = getOptionLabel(option);
  inputValue.value = label;
  emit("update:modelValue", label);
  emit("select", option);
  isOpen.value = false;
  highlightedIndex.value = -1;
}

function onKeydown(e) {
  if (!isOpen.value && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
    isOpen.value = filteredOptions.value.length > 0;
    return;
  }

  switch(e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (filteredOptions.value.length === 0) return;
      highlightedIndex.value =
        (highlightedIndex.value + 1) % filteredOptions.value.length;
      break;
    case "ArrowUp":
      e.preventDefault();
      if (filteredOptions.value.length === 0) return;
      highlightedIndex.value =
        (highlightedIndex.value - 1 + filteredOptions.value.length) %
        filteredOptions.value.length;
      break;
    case "Enter":
      if (isOpen.value && highlightedIndex.value >= 0) {
        e.preventDefault();
        const opt = filteredOptions.value[highlightedIndex.value];
        if (opt) selectOption(opt);
      }
      break;
  case "Escape":
      isOpen.value = false;
      highlightedIndex.value = -1;
  }
}

function onBlur() {
  // kein auto-select – nur schließen
  setTimeout(() => {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }, 150);
}
</script>

<template>
  <div class="position-relative mb-3">
    <label
      v-if="label"
      class="form-label"
      for="{{label}}-input-autosuggest"
    >
      {{ $t ? $t(label) : label }}
    </label>

    <input
      id="{{label}}-input-autosuggest"
      class="form-control"
      type="text"
      :value="inputValue"
      :placeholder="$t ? $t(placeholder) : placeholder"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeydown"
      @blur="onBlur"
    >

    <div
      v-if="isOpen && filteredOptions.length > 0"
      class="list-group position-absolute w-100 shadow-sm"
      style="z-index: 1000; max-height: 200px; overflow-y: auto;"
    >
      <button
        v-for="(option, index) in filteredOptions"
        :key="getOptionLabel(option) + index"
        type="button"
        class="list-group-item list-group-item-action"
        :class="{ active: index === highlightedIndex }"
        @mousedown.prevent="selectOption(option)"
      >
        {{ getOptionLabel(option) }}
      </button>
    </div>

    <div
      v-if="error"
      class="invalid-feedback d-block"
    >
      {{ error }}
    </div>
  </div>
</template>
