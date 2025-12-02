<script setup>
import { onMounted, ref, computed } from "vue";
import { useCatalogService } from "@/services/catalogService.js";
import BaseSelect from "@/components/utils/BaseSelect.vue";

const { getCatalogData } = useCatalogService();

// Props für v-model
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

// v-model-Event
const emit = defineEmits(["update:modelValue"]);

// rohe Daten aus dem Katalog
const emergingChicks = ref([]);

// v-model-Bridge, weil props read-only sind
const selectedHatchery = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

// Optionen für BaseSelect (value/label-Paare)
const emergingChicksOptions = computed(() =>
    emergingChicks.value.map((hatchery) => ({
      value: hatchery.Name, // ACHTUNG: "Name", nicht "name"
      label: hatchery.Name,
    })),
);

onMounted(async () => {
  const data = await getCatalogData("schlupfbrutverfahren");
  // defensive: falls undefined/null
  emergingChicks.value = Array.isArray(data) ? data : [];
});
</script>

<template>
  <BaseSelect
    v-model="selectedHatchery"
    :options="emergingChicksOptions"
  />
</template>
