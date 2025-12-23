<script setup>

import Alert from "@/components/utils/Alert.vue";
import { ref, watch } from "vue";
import { useJournalService } from "@/services/journalService.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseDateStepper from "@/components/utils/BaseDateStepper.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import FeedingPhaseToggle from "@/components/FeedingPhaseToggle.vue";
import MixFoodPercentageCalc from "@/components/journal/MixFoodPercentageCalc.vue";
import LossForm from "@/components/journal/LossForm.vue";
import BaseTextarea from "@/components/utils/BaseTextarea.vue";
import BadgeCheckbox from "@/components/utils/BadgeCheckbox.vue";
import Card from "@/components/ui/Card.vue";


const { getJournalData, putJournalData } = useJournalService()

const selectedHouse = ref(localStorage.getItem('selectedHouse') || '')
const selectedDate = ref(localStorage.getItem('selectedDate') || '')
const journalData = ref(null)
const dayOfLife = ref(0)

const apiV1Map = {
  animalWeight: "Tiergewicht",
  water: "Wasser",
  mixfood: "Mischfutter",
  wheat: "Getreide",
  tempMin: "TemperaturMin",
  tempMax: "TemperaturMax",
  humidityMin: "FeuchtigkeitMin",
  humidityMax: "FeuchtigkeitMax",
  VerlusteMorgensKleine: "VerlusteMorgensKleine",
  VerlusteMorgensSelektierte: "VerlusteMorgensSelektierte",
  VerlusteMorgensTote: "VerlusteMorgensTote",
  VerlusteAbendsKleine: "VerlusteAbendsKleine",
  VerlusteAbendsSelektierte: "VerlusteAbendsSelektierte",
  VerlusteAbendsTote: "VerlusteAbendsTote",
  notes: "Bemerkungen",
  alarm: "Alarm",
  emergencyPower: "Notstrom",
  technology: "Stalltechnik"
}

const form = ref({
  animalWeight: '',
  water: '',
  mixfood: '',
  wheat: '',
  feedingPhases: [],
  VerlusteMorgensKleine: '',
  VerlusteMorgensSelektierte: '',
  VerlusteMorgensTote: '',
  VerlusteAbendsKleine: '',
  VerlusteAbendsSelektierte: '',
  VerlusteAbendsTote: '',
  tempMin: '',
  tempMax: '',
  humidityMin: '',
  humidityMax: '',
  notes: '',
  alarm: '',
  emergencyPower: '',
  technology: ''
})

watch([selectedHouse, selectedDate],
  async ([newHouse, newDate]) => {
    if (!newHouse || !newDate) {
      journalData.value = null
      return
    }
    localStorage.setItem('selectedHouse', newHouse)
    localStorage.setItem('selectedDate', newDate)

    try {
      const response = await getJournalData(newHouse, newDate)
      mapDataToForm(response.data)
      dayOfLife.value = response.data.Lebenstag
    } catch (error) {
      console.error('Fehler beim Laden der Journal-Daten:', error)
      journalData.value = null
    }
  }, { immediate: true })

watch(
  journalData,
  (data) => {
    mapDataToForm(data)
  },
  { immediate: true }
)

function isMonday() {
  const date = new Date(selectedDate.value);
  return date.getDay() === 1;
}

function mapDataToForm(data) {
  if (!data) {
    form.value.animalWeight = ''
    form.value.water = ''
    form.value.mixfood = ''
    form.value.wheat = ''
    form.value.feedingPhases = []
    form.value.VerlusteMorgensKleine = ''
    form.value.VerlusteMorgensSelektierte = ''
    form.value.VerlusteMorgensTote = ''
    form.value.VerlusteAbendsKleine = ''
    form.value.VerlusteAbendsSelektierte = ''
    form.value.VerlusteAbendsTote = ''
    form.value.tempMin = ''
    form.value.tempMax = ''
    form.value.humidityMin = ''
    form.value.humidityMax = ''
    form.value.notes = ''
    form.value.alarm = ''
    return
  }

  form.value.animalWeight = data.Tiergewicht ?? ''
  form.value.water = data.Wasser ?? ''
  form.value.mixfood = data.Mischfutter ?? ''
  form.value.wheat = data.Getreide ?? ''
  form.value.feedingPhases = [
    data.FutterphaseStart && 'FutterphaseStart',
    data.Futterphase1 && 'Futterphase1',
    data.Futterphase2 && 'Futterphase2',
    data.Futterphase3 && 'Futterphase3',
    data.FutterphaseEnde && 'FutterphaseEnde',
  ].filter(Boolean)
  form.value.tempMin = data.TemperaturMin
  form.value.tempMax = data.TemperaturMax
  form.value.humidityMin = data.FeuchtigkeitMin
  form.value.humidityMax = data.FeuchtigkeitMax
  form.value.VerlusteMorgensKleine = data.VerlusteMorgensKleine ?? ''
  form.value.VerlusteMorgensSelektierte = data.VerlusteMorgensSelektierte ?? ''
  form.value.VerlusteMorgensTote = data.VerlusteMorgensTote ?? ''
  form.value.VerlusteAbendsKleine = data.VerlusteAbendsKleine ?? ''
  form.value.VerlusteAbendsSelektierte = data.VerlusteAbendsSelektierte ?? ''
  form.value.VerlusteAbendsTote = data.VerlusteAbendsTote ?? ''
  form.value.notes = data.Bemerkungen ?? ''
  form.value.alarm = data.Alarm ?? ''
  form.value.technology = data.Stalltechnik ?? ''
  form.value.emergencyPower = data.Notstrom ?? ''
}

function mapToV1Api(key) {
  return apiV1Map[key] || key;
}

function submit() {
  let payload = {};
  Object.keys(form.value).forEach(key => {
    if (key === 'feedingPhases') {
      form.value[key].forEach(phase => payload[phase] = 1);
      return;
    }
    if (form.value[key] !== '') {
      if (key === "tempMin" || key === "tempMax" || key === "humidityMin" || key === "humidityMax") {
        payload[mapToV1Api(key)] = form.value[key]?.replace(',', '.');
      } else {
        payload[mapToV1Api(key)] = form.value[key];
      }
    }
  })
  putJournalData(selectedHouse.value, selectedDate.value, payload)
}
</script>

<template>
  <form
    class=""
    @submit.prevent="submit"
  >
    <Card>
      <section class="mb-5">
        <Alert type="info">
          {{ $t('journal.info') }}
        </Alert>
        <HouseSelect
          v-model="selectedHouse"
          :save-value="true"
        />
        <BaseDateStepper
          id="txtDatumTB"
          v-model="selectedDate"
        />
        <hr>
      </section>

      <section class="mb-5">
        <BaseInput
          v-model="form.animalWeight"
          type="number"
          label="journal.form.animal_weight"
          :label-end="$t('general.yesterday', { date: dayOfLife-1 })"
          group-unit="g"
        />

        <!-- Wasser -->
        <BaseInput
          v-model="form.water"
          type="number"
          label="journal.form.water"
          :label-end="$t('general.yesterday', { date: dayOfLife-1 })"
          group-unit="l"
        />
        <hr>
      </section>

      <section class="mb-5">
        <MixFoodPercentageCalc
          v-model:form="form"
          :day-of-life="dayOfLife"
        />

        <alert type="info">
          {{ $t('journal.form.phase_question') }}
        </alert>

        <FeedingPhaseToggle
          v-model="form.feedingPhases"
          label="journal.form.feeding_phase"
          :day-of-life="dayOfLife"
        />
        <hr>
      </section>

      <section class="mb-5">
        <div class="row mb-3">
          <BaseInput
            v-model="form.tempMin"
            type="text"
            label="journal.form.temperature"
            group-unit="°C"
            form-group-classes="col-6"
            placeholder="journal.form.temperature_min"
          />
          <BaseInput
            v-model="form.tempMax"
            type="text"
            group-unit="°C"
            label="&nbsp;"
            :label-end="$t('general.yesterday', { date: dayOfLife-1 })"
            form-group-classes="col-6"
            placeholder="journal.form.temperature_max"
          />
        </div>

        <div class="row">
          <BaseInput
            v-model="form.humidityMin"
            type="text"
            label="journal.form.humidity"
            group-unit="%"
            form-group-classes="col-6"
            placeholder="journal.form.humidity_min"
          />
          <BaseInput
            v-model="form.humidityMax"
            type="text"
            group-unit="%"
            form-group-classes="col-6"
            label="&nbsp;"
            :label-end="$t('general.yesterday', { date: dayOfLife-1 })"
            placeholder="journal.form.humidity_max"
          />
        </div>
        <hr>
      </section>

      <section
        v-if="dayOfLife > 14 && dayOfLife % 7 === 0"
        class="mb-5"
      >
        <div
          class="bg-black"
        >
          Foobar
        </div>
        <hr>
      </section>
      <section class="mb-5">
        <LossForm
          v-model:form="form"
          :day-of-life="dayOfLife"
        />
        <hr>
      </section>

      <section class="mb-5">
        <BaseTextarea
          v-model="form.notes"
          label="journal.form.notes"
          :label-end="$t('general.today', { date: dayOfLife })"
        />
        <hr>
      </section>

      <section class="mb-5">
        <span class="form-label pb-0 ps-0 d-flex justify-content-between">
          <span>{{ $t('journal.form.technology_checklist') }}</span>
          <span class="text-muted text-end">{{ $t('general.today', { date: dayOfLife }) }}</span>
        </span>
        <Alert v-if="isMonday()">
          <b>{{ $t('general.attention') }}: </b>{{ $t('journal.form.technology_checklist_warning') }}
        </Alert>
        <BadgeCheckbox
          id="alarm-checkbox"
          v-model="form.alarm"
          label="journal.form.alarm"
        />
        <BadgeCheckbox
          id="technology-checkbox"
          v-model="form.technology"
          label="journal.form.stalltechnik"
        />
        <BadgeCheckbox
          v-model="form.emergencyPower"
          label="journal.form.notstrom"
        />
      </section>
    </Card>


    <button
      class="btn btn-primary col-12"
      type="submit"
    >
      {{ $t('general.submit') }}
    </button>
  </form>
</template>
