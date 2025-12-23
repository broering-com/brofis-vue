<script setup>
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import { ref, watch } from "vue";

// Custom v-model:form
const form = defineModel("form", { type: Object, required: true });

const { dayOfLife } = defineProps({
  dayOfLife: { type: Number, default: 0 },
});

const showPercentages = ref(false);
const sum = ref(0);
const percentage = ref(0);

function updateForm(patch) {
  form.value = {
    ...form.value,
    ...patch,
  };
}

watch(
  showPercentages,
  (enabled) => {
    const mixfood = Number.parseInt(form.value?.mixfood || 0, 10);
    const wheat = Number.parseInt(form.value?.wheat || 0, 10);

    if (enabled) {
      const s = mixfood + wheat;
      sum.value = s;
      percentage.value = s > 0 ? (wheat / s) * 100 : 0;
    } else {
      const newMixfood = sum.value - (sum.value * percentage.value) / 100;
      const newWheat = (sum.value * percentage.value) / 100;

      updateForm({
        mixfood: Math.round(newMixfood),
        wheat: Math.round(newWheat),
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <BaseCheckbox
    v-model="showPercentages"
    label="journal.form.input_in_percentage"
    variant="switch"
  />

  <BaseInput
    v-model="form.mixfood"
    type="number"
    label="journal.form.mischfutter"
    :label-end="$t('general.yesterday', { date: dayOfLife - 1 })"
    group-unit="kg"
    :class="{ 'd-none': showPercentages }"
  />

  <BaseInput
    v-model="form.wheat"
    type="number"
    label="journal.form.wheat"
    :label-end="$t('general.yesterday', { date: dayOfLife - 1 })"
    group-unit="kg"
    :class="{ 'd-none': showPercentages }"
  />

  <BaseInput
    v-model="sum"
    type="number"
    label="journal.form.sum"
    :label-end="$t('general.yesterday', { date: dayOfLife - 1 })"
    :class="{ 'd-none': !showPercentages }"
    group-unit="kg"
  />

  <BaseInput
    v-model="percentage"
    type="number"
    label="journal.form.percentage"
    :label-end="$t('general.yesterday', { date: dayOfLife - 1 })"
    :class="{ 'd-none': !showPercentages }"
    group-unit="%"
  />
</template>
