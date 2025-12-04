<script setup>

import Card from "@/components/ui/Card.vue";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import router from "@/router/index.js";
import { onMounted, ref } from "vue";
import { useDateService } from "@/services/dateService.js";
import ToggleButtonGroup from "@/components/utils/ToggleButtonGroup.vue";
import { MEDICATION_TYPE_TOGGLE_OPTIONS } from "@/constants/medicationTypeToggleOptions.js";
import AutoSuggestInput from "@/components/utils/AutoSuggestInput.vue";
import { useCatalogService } from "@/services/catalogService.js";
import BaseSelect from "@/components/utils/BaseSelect.vue";
import { MEDICATION_UNITS } from "@/constants/medicationUnits.js";
import { useMedicationService } from "@/services/medicationService.js";
import { useNotifications } from "@/services/notificationService.js";

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  }
})

const { today } = useDateService();
const { getCatalogData } = useCatalogService();
const { getMedicationDetailsData, postMedicationData } = useMedicationService();
const { notifySuccess } = useNotifications();

const form = ref(createEmptyForm())
const productSuggestions = ref([])
const personSuggestions = ref([])
const unitOptions = ref(MEDICATION_UNITS)

function createEmptyForm(type) {
  // const threeDaysAgo = subtractDays(new Date(Date.now()), 3)
  const thisDay = today()
  // const selectedHouse = ref(props.house || '')

  return {
    type: type || "",
    receipt: "",
    date: thisDay,
    duration: "",
    diagnosis: "",
    unit: "",
    manufacturer: "",
    id: props.id || '',
    amount: "",
    person: "",
    product: "",
    housing: "",
    waitingTime: "",
    permit: "",
  };
}

const apiV1Map = {
  type: "Art",
  receipt: "Beleg",
  date: "Datum",
  duration: "Dauer",
  diagnosis: "Diagnose",
  unit: "Einheit",
  manufacturer: "Hersteller",
  id: "ID",
  amount: "Menge",
  person: "Person",
  product: "Produkt",
  housing: "Stall",
  waitingTime: "Wartezeit",
  permit: "Zulassung",
}

const apiV1ReverseMap = Object.fromEntries(
    Object.entries(apiV1Map).map(([front, back]) => [back, front])
)

function mapFormToApi(key) {
  return apiV1Map[key] || key;
}

function mapApiToForm(key) {
  return apiV1ReverseMap[key] || key;
}

function getProductSuggestionsForType(type) {
  return getCatalogData(type)
}

function onSelect(selectedObject) {
  form.value.manufacturer = selectedObject.Hersteller
  form.value.waitingTime = selectedObject.Wartezeit
  form.value.permit = selectedObject.Zulassung
}

function oncancel() {
  router.push({ name: 'medications' })
}

async function loadMedication() {
  if (!props.id) {
    form.value = createEmptyForm();
    return
  }
  const result = await getMedicationDetailsData(props.id)
  if (result.success) {
    Object.keys(result.data).forEach(key => {
      form.value[mapApiToForm(key)] = result.data[key];
    })

    await loadProductSuggestions()
    await loadPersonSuggestions()
  }
}

async function loadProductSuggestions() {
  const key = MEDICATION_TYPE_TOGGLE_OPTIONS.find(option => option.value === form.value.type).catalogKey;
  productSuggestions.value = await getProductSuggestionsForType(key);
}

async function onTypeChange(val) {
  // Nur hier Formular leeren – dieser Handler feuert nur bei Userinput
  form.value = createEmptyForm(val)

  const option = MEDICATION_TYPE_TOGGLE_OPTIONS.find(option => option.value === val)
  if (option) {
    await loadProductSuggestions()
  }
}

async function loadPersonSuggestions() {
  const result = await getCatalogData('personen')
  personSuggestions.value = result
}

async function submit() {
  // foobar
  let payload = {};
  Object.keys(form.value).forEach(key => {
    if (form.value[key] !== '') {
      payload[mapFormToApi(key)] = form.value[key];
    }
  })
  const result = await postMedicationData(payload)
  if (result.success) {
    notifySuccess('events.medications.details.success', 10000)
    router.push({ name: 'medications' })
  }
}

onMounted(() => {
  loadMedication()
})
</script>

<template>
  <h1 class="title">
    <button
      class="btn btn-outline-primary"
      @click="oncancel"
    >
      <i class="bi bi-arrow-left-square" /> (cancel)
    </button>
    {{ $t('events.medications.details.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <house-select v-model="form.housing" />
      <base-input
        v-model="form.date"
        label="events.medications.date"
        type="date"
      />

      <ToggleButtonGroup
        v-model="form.type"
        label="events.medications.details.type"
        :options="MEDICATION_TYPE_TOGGLE_OPTIONS"
        @update:model-value="onTypeChange"
      />

      <AutoSuggestInput
        v-model="form.product"
        label="events.medications.details.product"
        :options="productSuggestions"
        display-key="Name"
        @select="onSelect"
      />

      <BaseInput
        v-show="form.type !== 'Sonstige'"
        v-model="form.permit"
        label="events.medications.details.permit"
      />

      <BaseInput
        v-show="form.type === 'Antibiotikum'"
        v-model="form.waitingTime"
        label="events.medications.details.waiting_time"
      />
      <BaseInput
        v-show="form.type === 'Antibiotikum'"
        v-model="form.diagnosis"
        label="events.medications.details.diagnosis"
      />
      <BaseInput
        v-show="form.type === 'Antibiotikum' || form.type === 'Sonstige'"
        v-model="form.duration"
        label="events.medications.details.duration"
      />


      <BaseInput
        v-show="form.type !== 'Sonstige'"
        v-model="form.manufacturer"
        label="events.medications.details.manufacturer"
      />
      <div
        class="row"
      >
        <BaseInput
          v-model="form.amount"
          class="col-6"
          label="events.medications.details.amount"
        />
        <BaseSelect
          v-model="form.unit"
          label="events.medications.details.unit"
          class="col-6"
          :options="unitOptions"
        />
      </div>

      <BaseInput
        v-model="form.receipt"
        label="events.medications.details.receipt"
      />
      <AutoSuggestInput
        v-model="form.person"
        label="events.medications.details.person"
        :options="personSuggestions"
      />

      <button
        type="submit"
        class="btn btn-primary w-100"
      >
        {{ $t('general.submit') }}
      </button>
    </card>
  </form>
</template>

<style scoped>

</style>