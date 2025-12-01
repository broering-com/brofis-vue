<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useHousingService } from "@/services/housingService";
import { useNotifications } from "@/services/notificationService";
import { useHousingSelection } from "@/composables/useHousingSelection.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import Card from "@/components/ui/Card.vue";
import BaseCollapse from "@/components/utils/BaseCollapse.vue";
import Alert from "@/components/utils/Alert.vue";

const { selectedHousing } = useHousingSelection();

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
})

const { getHousingDetailsData } = useHousingService();
const { notifyError } = useNotifications();

const isEditMode = computed(() => !!props.id);

const form = ref(createEmptyForm()) // deine eigene Funktion / Struktur
const isAnimalCollapseOpen = ref(false)
const isQsCollapseOpen = ref(false)
const isCleaningCollapseOpen = ref(false)

function createEmptyForm() {
  return {
    hatchery: "",
    date: "",
    disinfectantSurfacesDate: "",
    disinfectantSurfaces: "",
    disinfectantWateringPlaceDate: "",
    disinfectantWateringPlace: "",
    bedding: "",
    food: "",
    origin: "",
    originDetails: "",
    id: "",
    itw: false,
    import: 0,
    dayOfLife: "",
    weekOfLife: "",
    deliveryNote: "",
    qs: false,
    race: "",
    regionalWindow: false,
    rodendPests: "",
    rodendPestsContinuity: false,
    emergingChicks: "",
    housing: "",
    animalWeight: "",
    animalWelfareLabel: "",
    animalLosses: "",
    animalCount: "",
    vlog: false,
    water: "",
    wateringPlace: "",
    flockNumber: "",
  };
}

async function loadHousing() {
  console.log('### loadHousing', isEditMode.value, props, props.id)
  if (!isEditMode.value) {
    // kein Edit → leeres Formular
    form.value = createEmptyForm();
    isAnimalCollapseOpen.value = true;
    isQsCollapseOpen.value = true;
    isCleaningCollapseOpen.value = true;
    return;
  }

  try {
    const housing = selectedHousing.value;
    console.log(housing);
    const result = await getHousingDetailsData(housing.Stall, housing.Datum);
    if (result.success) {
      // API-Response passend ins Form mappen
      Object.keys(result.data).forEach((key) => {
        form.value[mapApiToForm(key)] = result.data[key];
      })
      console.log(form.value);
    } else {
      notifyError(result.message || "Fehler beim Laden der Einstallung.");
    }
  } catch (e) {
    console.error(e);
    notifyError("Fehler beim Laden der Einstallung.");
  }
}

const apiV1Map = {
    id: "ID",
    housing: "Stall",
    date: "Datum",
    animalCount: "Tierzahl",
    hatchery: "Brueterei",
    race: "Rasse",
    emergingChicks: "Schlupfbrut",
    flockNumber: "Herde",
    weekOfLife: "Lebenswoche",
    deliveryNotes: "Lieferschein",
    dayOfLife: "Lebenstag",
    animalWeight: "Tiergewicht",
    food: "Futter",
    water: "Wasser",
    animalLosses: "Tierverluste",
    origin: "Herkunft",
    originDetails: "HerkunftDetail",
    qs: "QS",
    itw: "ITW",
    vlog: "VLOG",
    animalWelfareLabel: "Tierschutzlabel1",
    regionalWindow: "Regionalfenster",
    bedding: "Einstreu",
    wateringPlace: "Wasserversorgung",
    rodendPests: "Schadnager",
    disinfectantSurfacesDate: "DesinfektionFlaecheDatum",
    disinfectantWateringPlaceDate: "DesinfektionTraenkeDatum",
    rodendPestsContinuity: "SchadnagerKontinuierlich",
    disinfectantSurfaces: "DesinfektionFlaecheMittel",
    disinfectantWateringPlace: "DesinfektionTraenkeMittel",
    import: "Import",
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

onMounted(() => {
  loadHousing();
});
</script>

<template>
  <h1 class="title">
    <button class="btn btn-outline-primary">
      <i class="bi bi-arrow-left-square" /> (cancel)
    </button>
    {{$t('events.housings.details.title') }}
  </h1>

  <Card class="mb-3">
    <house-select v-model="form.housing" />
    <base-input
      v-model="form.date"
      label="events.housings.date"
      type="date"
    />
  </Card>

  <BaseCollapse
    v-model="isAnimalCollapseOpen"
    title="events.housings.details.animals">
    <BaseInput
      v-model="form.hatchery"
      label="events.housings.details.hatchery"
    />
    <BaseInput
      v-model="form.race"
      label="events.housings.details.race"
    />
    <BaseInput
      v-model="form.emergingChicks"
      label="events.housings.details.emerging_chicks"
    />

    <Alert type="info">
      {{ $t('events.housings.details.multiple_herds_info')}}
    </Alert>

    <BaseInput
      v-model="form.flockNumber"
      label="events.housings.details.flock_number"
    />

    <div class="row">
      <BaseInput
        v-model="form.weekOfLife"
        label="events.housings.details.week_of_life"
        class="col-6"
      />

      <BaseInput
        v-model="form.dayOfLife"
        label="events.housings.details.day_of_life"
        class="col-6"
      />
    </div>

    <BaseInput
      v-model="form.deliveryNote"
      label="events.housings.details.delivery_note"
    />
  </BaseCollapse>

  <BaseCollapse
    v-model="isQsCollapseOpen"
    title="events.housings.details.qs"
  >
    Test
  </BaseCollapse>

  <BaseCollapse
    v-model="isCleaningCollapseOpen"
    title="events.housings.details.cleaning"
  >
    Test
  </BaseCollapse>

  <!-- dein Formular mit v-model="form.Feld" -->
</template>
