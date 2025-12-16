<script setup>
import BaseSelect from "@/components/utils/BaseSelect.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useHousingService } from "@/services/housingService.js";
import { useDateService } from '@/services/dateService.js';

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  selectedHouse: {
    type: String,
    default: "all"
  },
  hasAllOption: {
    type: Boolean,
    default: true,
  },
  classes: {
    type: String,
    default: "mb-3"
  }
})
const emit = defineEmits(["update:modelValue"]);

const { getHousings } = useHousingService()
const { formatReadable } = useDateService()

const defaultOption = { value: 'all', label: 'general.all' }
const options = ref([{ value: 'all', label: 'general.all' }])

const internalValue = computed({
  get: () => props.modelValue || 'all',
  set: (value) => emit("update:modelValue", value)
})

async function loadHousingsforHouse(house) {
  if (!house || house === "all" && props.hasAllOption) {
    options.value = [defaultOption]
    emit("update:modelValue", "all")
    return
  }

  try {
    const result = await getHousings(house)
    if (result?.success) {
      const housingOptions = result.data.map((housing) => {
        return {
          "value": housing,
          "label": formatReadable(housing)
        }
      })
      if (props.hasAllOption) {
        options.value = [defaultOption, ...housingOptions]
      } else {
        const array = []
        housingOptions.forEach(option => array.push(option))
        options.value = array
      }
    } else {
      options.value = defaultOption
    }
    emit("update:modelValue", props.hasAllOption ? "all" : options.value[0])
  } catch (e) {
    console.error(e)
    options.value = defaultOption
    emit("update:modelValue", "all")
  }
}

watch(
    () => props.selectedHouse,
    (newHouse) => loadHousingsforHouse(newHouse),
    { immediate: true }
)

onMounted(() => {
  if (!props.modelValue) {
    emit("update:modelValue", options.value[0].value);
  }
})
</script>

<template>
  <BaseSelect
    v-model="internalValue"
    :options="options"
    :disabled="selectedHouse === 'all'"
    :class="classes"
    label="general.housing"
  />
</template>
