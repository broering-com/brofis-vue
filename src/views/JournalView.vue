<script setup>

import Alert from "@/components/utils/Alert.vue";
import {useUserConfig} from "@/services/userConfigService.js";
import {reactive, ref, watch} from "vue";
import {useJournalService} from "@/services/journalService.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseDateStepper from "@/components/utils/BaseDateStepper.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import FeedingPhaseToggle from "@/components/FeedingPhaseToggle.vue";
import MixFoodPercentageCalc from "@/components/journal/MixFoodPercentageCalc.vue";
import LossForm from "@/components/journal/LossForm.vue";
import BaseTextarea from "@/components/utils/BaseTextarea.vue";
import BadgeCheckbox from "@/components/utils/BadgeCheckbox.vue";
import Card from "@/components/ui/Card.vue";


const {getJournalData} = useJournalService()
const {userConfig, isUserConfigLoading, userConfigError} = useUserConfig()

const selectedHouse = ref(localStorage.getItem('selectedHouse') || '')
const selectedDate = ref(localStorage.getItem('selectedDate') || '')
const journalData = ref(null)

const form = reactive({
  tiergewicht: '',
  wasser: '',
  eingabeInProzent: false,
  mischfutter: '',
  weizen: '',
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
  Bemerkungen: '',
  Alarm: '',
  Notstrom: '',
  Stalltechnik: ''
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
        const data = await getJournalData(newHouse, newDate)
        mapDataToForm(data.data)
      } catch (error) {
        console.error('Fehler beim Laden der Journal-Daten:', error)
        journalData.value = null
      }
    }, {immediate: true})

watch(
    journalData,
    (data) => {
      mapDataToForm(data)
    },
    {immediate: true}
)

function mapDataToForm(data) {
  if (!data) {
    form.tiergewicht = ''
    form.wasser = ''
    form.eingabeInProzent = false
    form.mischfutter = ''
    form.weizen = ''
    form.feedingPhases = []
    form.VerlusteMorgensKleine = ''
    form.VerlusteMorgensSelektierte = ''
    form.VerlusteMorgensTote = ''
    form.VerlusteAbendsKleine = ''
    form.VerlusteAbendsSelektierte = ''
    form.VerlusteAbendsTote = ''
    form.tempMin = ''
    form.tempMax = ''
    form.humidityMin = ''
    form.humidityMax = ''
    form.Bemerkungen = ''
    form.Alarm = ''
    return
  }

  form.tiergewicht = data.Tiergewicht ?? ''
  form.wasser = data.Wasser ?? ''
  form.mischfutter = data.Mischfutter ?? ''
  form.weizen = data.Getreide ?? ''
  form.feedingPhases = [
    data.FutterphaseStart && 'FutterphaseStart',
    data.Futterphase1 && 'Futterphase1',
    data.Futterphase2 && 'Futterphase2',
    data.Futterphase3 && 'Futterphase3',
    data.FutterphaseEnde && 'FutterphaseEnde',
  ].filter(Boolean)
  form.tempMin = data.TemperaturMin
  form.tempMax = data.TemperaturMax
  form.humidityMin = data.FeuchtigkeitMin
  form.humidityMax = data.FeuchtigkeitMax
  form.VerlusteMorgensKleine = data.VerlusteMorgensKleine ?? ''
  form.VerlusteMorgensSelektierte = data.VerlusteMorgensSelektierte ?? ''
  form.VerlusteMorgensTote = data.VerlusteMorgensTote ?? ''
  form.VerlusteAbendsKleine = data.VerlusteAbendsKleine ?? ''
  form.VerlusteAbendsSelektierte = data.VerlusteAbendsSelektierte ?? ''
  form.VerlusteAbendsTote = data.VerlusteAbendsTote ?? ''
  form.Bemerkungen = data.Bemerkungen ?? ''
  form.Alarm = data.Alarm ?? ''
}

function submit() {
  console.log('### foobar', {house: selectedHouse.value, date: selectedDate.value, ...form})
}
</script>

<template>

  <form @submit.prevent="submit" class="">
    <Card classes="mb-4">
      <Alert type="info">{{ $t('journal.info') }}</Alert>
      <HouseSelect v-model="selectedHouse"/>
      <BaseDateStepper v-model="selectedDate"
                       id="txtDatumTB"/>
    </Card>

    <Card>
      <BaseInput
          v-model="form.tiergewicht"
          type="number"
          label="journal.form.tiergewicht"
          groupUnit="g"
      />

      <!-- Wasser -->
      <BaseInput
          v-model="form.wasser"
          type="number"
          label="journal.form.wasser"
          groupUnit="l"
      />
    </Card>

    <Card classes="mb-4">
      <MixFoodPercentageCalc :form="form"/>
    </Card>
    <Card>
      <alert type="info">
        {{ $t('journal.form.phase_question') }}
      </alert>

      <FeedingPhaseToggle v-model="form.feedingPhases" label="journal.form.feedingphase"></FeedingPhaseToggle>
    </Card>

    <Card classes="mb-4">
      <div class="row">
        <BaseInput v-model="form.tempMin"
                   type="text"
                   label="journal.form.temperature"
                   groupUnit="°C"
                   formGroupClasses="col-6"
                   placeholder="journal.form.temperature_min"></BaseInput>
        <BaseInput v-model="form.tempMax"
                   type="text"
                   groupUnit="°C"
                   labelEnd="Gestern"
                   formGroupClasses="col-6"
                   placeholder="journal.form.temperature_max"></BaseInput>
      </div>

      <div class="row">
        <BaseInput v-model="form.humidityMin"
                   type="text"
                   label="journal.form.humidity"
                   groupUnit="%"
                   formGroupClasses="col-6"
                   placeholder="journal.form.humidity_min"></BaseInput>
        <BaseInput v-model="form.humidityMax"
                   type="text"
                   groupUnit="°C"
                   formGroupClasses="col-6"
                   labelEnd="Gestern"
                   placeholder="journal.form.humidity_max"></BaseInput>
      </div>
    </Card>


    <Card classes="mb-4">
      <LossForm :form="form"></LossForm>
    </Card>

    <Card classes="mb-4">

      <BaseTextarea v-model="form.Bemerkungen"
                    label="journal.form.notes"
      ></BaseTextarea>
    </Card>

    <Card classes="mb-4">
      <BadgeCheckbox v-model="form.Alarm" label="journal.form.alarm"></BadgeCheckbox>
      <BadgeCheckbox v-model="form.Stalltechnik" label="journal.form.stalltechnik"></BadgeCheckbox>
      <BadgeCheckbox v-model="form.Notstrom" label="journal.form.notstrom"></BadgeCheckbox>
    </Card>



    <button @submit.prevent="submit"
            class="btn btn-primary col-12">
      {{ $t('general.submit') }}
    </button>
  </form>
</template>
