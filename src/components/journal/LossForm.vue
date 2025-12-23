<script setup>
import BaseInput from "@/components/utils/BaseInput.vue";
import { computed } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  dayOfLife: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["update:form"]);

// Hilfsfunktion: Form-Feld patchen und neues Objekt emittieren
function updateFormField(key, value) {
  emit("update:form", {
    ...props.form,
    [key]: value,
  });
}

// Computeds für die einzelnen Felder
const verlusteMorgensKleine = computed({
  get: () => props.form.VerlusteMorgensKleine,
  set: (val) => updateFormField("VerlusteMorgensKleine", val),
});

const verlusteMorgensSelektierte = computed({
  get: () => props.form.VerlusteMorgensSelektierte,
  set: (val) => updateFormField("VerlusteMorgensSelektierte", val),
});

const verlusteMorgensTote = computed({
  get: () => props.form.VerlusteMorgensTote,
  set: (val) => updateFormField("VerlusteMorgensTote", val),
});

const verlusteAbendsKleine = computed({
  get: () => props.form.VerlusteAbendsKleine,
  set: (val) => updateFormField("VerlusteAbendsKleine", val),
});

const verlusteAbendsSelektierte = computed({
  get: () => props.form.VerlusteAbendsSelektierte,
  set: (val) => updateFormField("VerlusteAbendsSelektierte", val),
});

const verlusteAbendsTote = computed({
  get: () => props.form.VerlusteAbendsTote,
  set: (val) => updateFormField("VerlusteAbendsTote", val),
});
</script>

<template>
  <div class="form-label pb-0 ps-0 mb-2 col-12 text-end">
    <span class="text-muted text-end">
      {{ $t('general.today', { date: dayOfLife }) }}
    </span>
  </div>

  <div class="row">
    <div class="col-3 text-center">
      <span class="form-label">
        {{ $t('journal.form.losses') }}
      </span>
    </div>
    <div class="col-3 text-center">
      <span class="form-label">
        {{ $t('journal.form.losses_small') }}
      </span>
    </div>
    <div class="col-3 text-center">
      <span class="form-label">
        {{ $t('journal.form.losses_selected') }}
      </span>
    </div>
    <div class="col-3 text-center">
      <span class="form-label">
        {{ $t('journal.form.losses_dead') }}
      </span>
    </div>
  </div>

  <div class="row">
    <!-- Morgens -->
    <div class="col-3 pt-2 my-auto align-content-center d-flex justify-content-center">
      <span class="form-label mb-0">
        {{ $t('journal.form.losses_morning') }}
      </span>
    </div>
    <div class="col-3">
      <BaseInput
        v-model="verlusteMorgensKleine"
        label="journal.form.losses_morning_small"
        :show-label="false"
      />
    </div>
    <div class="col-3">
      <BaseInput
        v-model="verlusteMorgensSelektierte"
        label="journal.form.losses_morning_selected"
        :show-label="false"
      />
    </div>
    <div class="col-3">
      <BaseInput
        v-model="verlusteMorgensTote"
        label="journal.form.losses_morning_dead"
        :show-label="false"
      />
    </div>

    <!-- Abends -->
    <div class="col-3 pt-2 my-auto align-content-center d-flex justify-content-center">
      <span class="form-label mb-0">
        {{ $t('journal.form.losses_evening') }}
      </span>
    </div>
    <div class="col-3">
      <BaseInput
        v-model="verlusteAbendsKleine"
        label="journal.form.losses_evening_small"
        :show-label="false"
      />
    </div>
    <div class="col-3">
      <BaseInput
        v-model="verlusteAbendsSelektierte"
        label="journal.form.losses_evening_selected"
        :show-label="false"
      />
    </div>
    <div class="col-3">
      <BaseInput
        v-model="verlusteAbendsTote"
        label="journal.form.losses_evening_dead"
        :show-label="false"
      />
    </div>
  </div>
</template>