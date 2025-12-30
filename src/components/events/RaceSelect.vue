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
const races = ref([]);

// v-model-Bridge, weil props read-only sind
const selectedRace = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

// Optionen für BaseSelect (value/label-Paare)
const raceOptions = computed(() =>
    races.value.map((race) => ({
      value: race.Name, // ACHTUNG: "Name", nicht "name"
      label: race.Name,
    })),
);

onMounted(async () => {
  const data = await getCatalogData("rassen");
  // defensive: falls undefined/null
  races.value = Array.isArray(data) ? data : [];
});
</script>

<template>
  <BaseSelect
    v-model="selectedRace"
    :options="raceOptions"
  />
</template>
