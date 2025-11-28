<script setup>
import BaseInput from "@/components/utils/BaseInput.vue";
import { computed } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
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
  <label class="form-label pb-0 ps-0 mb-0 col-12 text-end">
    <span class="text-muted text-end">
      {{ $t('general.today') }}
    </span>
  </label>

  <div class="row">
    <div class="col-3">
      <label class="form-label">
        {{ $t('journal.form.losses') }}
      </label>
    </div>
    <div class="col-3">
      <label class="form-label">
        {{ $t('journal.form.losses_small') }}
      </label>
    </div>
    <div class="col-3">
      <label class="form-label">
        {{ $t('journal.form.losses_selected') }}
      </label>
    </div>
    <div class="col-3">
      <label class="form-label">
        {{ $t('journal.form.losses_dead') }}
      </label>
    </div>
  </div>

  <div class="row">
    <!-- Morgens -->
    <div class="col-3">
      <label class="form-label">
        {{ $t('journal.form.losses_morning') }}
      </label>
    </div>
    <div class="col-3">
      <BaseInput v-model="verlusteMorgensKleine" />
    </div>
    <div class="col-3">
      <BaseInput v-model="verlusteMorgensSelektierte" />
    </div>
    <div class="col-3">
      <BaseInput v-model="verlusteMorgensTote" />
    </div>

    <!-- Abends -->
    <div class="col-3 mt-2">
      <label class="form-label">
        {{ $t('journal.form.losses_evening') }}
      </label>
    </div>
    <div class="col-3 mt-2">
      <BaseInput v-model="verlusteAbendsKleine" />
    </div>
    <div class="col-3 mt-2">
      <BaseInput v-model="verlusteAbendsSelektierte" />
    </div>
    <div class="col-3 mt-2">
      <BaseInput v-model="verlusteAbendsTote" />
    </div>
  </div>
</template>