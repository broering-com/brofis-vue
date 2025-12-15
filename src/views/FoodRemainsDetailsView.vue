<script setup>

import Card from "@/components/ui/Card.vue";
import { useFoodRemainsService } from "@/services/foodRemainsService.js";
import { useNotifications } from "@/services/notificationService.js";
import { onMounted, ref } from "vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import BaseSelect from "@/components/utils/BaseSelect.vue";
import { FEEDING_PHASE_OPTIONS } from "@/constants/feedingPhaseOptions.js";
import { useDateService } from "@/services/dateService.js";
import router from "@/router/index.js";

const { getFoodRemainsDetailsData, putFoodRemainsDetailsData } = useFoodRemainsService();
const { notifyError, notifySuccess } = useNotifications();
const { formatReadable } = useDateService();


const { facility, date } = defineProps({
  facility: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  }
})

const form = ref([])
const startDate = ref("")

const apiV1Map = {
  foodPhaseStart: "FutterphaseStart",
  foodPhaseStop: "FutterphaseStop",
  amountStart: "MengeStart",
  amountStop: "MengeStop",
  silo: "Silo"
}

function mapFormToApi(key) {
  return apiV1Map[key] || key;
}


function generateForm(formData) {
  return {
    foodPhaseStart: formData.FutterphaseStart,
    foodPhaseStop: formData.FutterphaseStop,
    amountStart: formData.MengeStart,
    amountStop: formData.MengeStop,
    silo: formData.Silo
  };
}

async function loadFoodRemainsDetailsData() {
  const result = await getFoodRemainsDetailsData(facility, date)
  if (result.success) {
    result.data.forEach(entry => {
      if (!startDate.value) {
        startDate.value = entry.DatumStart
      }
      form.value.push(generateForm(entry))
    })
  } else {
    notifyError(result.message)
  }
}

async function submit() {
  const payload = [];
  form.value.forEach((formBlock) => {
    const payloadEntry = {};
    Object.keys(formBlock).forEach(key => {
      if (formBlock[key] !== '' && formBlock[key] !== null) {
        payloadEntry[mapFormToApi(key)] = formBlock[key];
      }
    })
    payload.push(payloadEntry);
  })

  const result = await putFoodRemainsDetailsData(facility, date, payload)
  if (result.success) {
    notifySuccess('events.food_remains.details.submit_success')
    router.push({ name: 'foodRemains' })
  }
}

onMounted(() => {
  loadFoodRemainsDetailsData()
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
    {{ $t('events.food_remains.details.title') }}
  </h1>

  <form @submit.prevent="submit">
    <Card class="mb-3">
      <div class="row mb-3 text-center">
        <div class="col-4 my-auto">
          {{ $t('general.silo') }}
        </div>
        <div class="col-4 my-auto">
          {{ $t('general.start') }}<br>
          {{ $t('events.food_remains.details.level_start_timestamp', { date: formatReadable(startDate) }) }}
        </div>
        <div class="col-4 my-auto">
          {{ $t('general.end') }}<br>
          {{ $t('events.food_remains.details.level_stop_timestamp') }}
        </div>
      </div>
      <template
        v-for="formBlock in form"
        :key="formBlock.silo"
      >
        <div class="row mb-3">
          <div class="col-4 text-center my-auto">
            {{ formBlock.silo }}
          </div>
          <div class="col-4 my-auto">
            <div class="row">
              <div class="col-6">
                <BaseInput
                  v-model="formBlock.amountStart"
                  type="number"
                  group-unit="general.kilograms_short"
                />
              </div>
              <div class="col-6">
                <BaseSelect
                  v-model="formBlock.foodPhaseStart"
                  :options="FEEDING_PHASE_OPTIONS"
                  :disabled="formBlock.amountStart === 0"
                />
              </div>
            </div>
          </div>
          <div class="col-4 my-auto">
            <div class="row">
              <div class="col-6">
                <BaseInput
                  v-model="formBlock.amountStop"
                  type="number"
                  group-unit="general.kilograms_short"
                />
              </div>
              <div class="col-6">
                <BaseSelect
                  v-model="formBlock.foodPhaseStop"
                  :options="FEEDING_PHASE_OPTIONS"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <button
        type="button"
        class="btn btn-primary w-100"
        @click="submit"
      >
        {{ $t('events.food_remains.details.submit_button') }}
      </button>
    </Card>
  </form>
</template>