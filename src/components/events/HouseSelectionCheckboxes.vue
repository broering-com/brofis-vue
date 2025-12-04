<script setup>
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import { useUserConfig } from "@/services/userConfigService.js";
import { onMounted, ref } from "vue";

const { userConfig } = useUserConfig()
const emit = defineEmits(["houseSelected", "houseDeselected"])
const houses = ref([])

const { duplicationTargetName } = defineProps({
  duplicationTargetName: {
    type: String,
    required: true,
  }
})

onMounted(() => {
  houses.value = userConfig.value.houses
})

function onchange(house, checked) {
  if (checked) {
    emit("houseSelected", house.Bezeichnung); // oder das ganze Objekt, wie du magst
  } else {
    emit("houseDeselected", house.Bezeichnung)
  }
}

</script>

<template>
  <BaseCheckbox
    v-for="house in houses"
    :key="house.Bezeichnung"
    :label="house.Bezeichnung"
    container-classes="mb-1 mt-2"
    :model-value="duplicationTargetName === house.Bezeichnung"
    :disabled="duplicationTargetName === house.Bezeichnung"
    @update:model-value="(val) => onchange(house, val)"
  />
</template>
