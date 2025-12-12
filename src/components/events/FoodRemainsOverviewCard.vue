<script setup>

import Card from "@/components/ui/Card.vue";
import { useDateService } from "@/services/dateService.js";

const { formatReadable } = useDateService()

const { remains } = defineProps(
  {
    remains: {
      type: Object,
      required: true
    }
  }
)

const emit = defineEmits(["edit"])

function onEditClick() {
  emit("edit", remains)
}
</script>

<template>
  <Card>
    <div class="row align-items-center">
      <div class="col-6 col-lg-3 fw-bold center-vertical">
        {{ formatReadable(remains.Datum) }}
      </div>
      <div class="col-6 col-lg-3 center-vertical my-lg-3">
        {{ remains.Anlage }}
      </div>
      <div class="col-6 col-lg-2 center-vertical">
        {{ remains.MengeStart }} {{ $t("general.kilograms_short") }}
      </div>
      <div class="col-6 col-lg-2 center-vertical">
        {{ remains.MengeStop }} {{ $t("general.kilograms_short") }}
      </div>
      <div class="col-12 col-lg-2 d-flex justify-content-end mt-3 mt-lg-0">
        <button
          class="btn btn-primary my-1 mx-1"
          type="button"
          @click="onEditClick"
        >
          {{ $t('general.edit') }}
        </button>
      </div>
    </div>
  </Card>
</template>