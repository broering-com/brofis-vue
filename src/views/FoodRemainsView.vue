<script setup>

import Alert from "@/components/utils/Alert.vue";
import FacilitySelect from "@/components/FacilitySelect.vue";
import { ref, watch } from "vue";
import { useNotifications } from "@/services/notificationService.js";
import { useFoodRemainsService } from "@/services/foodRemainsService.js";
import Card from "@/components/ui/Card.vue";
import FoodRemainsOverviewCard from "@/components/events/FoodRemainsOverviewCard.vue";

const { notifyError } = useNotifications()
const { getFoodRemainsData } = useFoodRemainsService()

const selectedFacility = ref("")
const currentPage = ref(0)

const remains = ref([])

async function loadFoodRemainsData() {
  const facility = selectedFacility.value === "all" ? null : selectedFacility.value;

  try {
    const result = await getFoodRemainsData(facility, currentPage.value)

    if(result.success) {
      remains.value = result.data
    } else {
      notifyError(result.message)
    }
  } catch (e) {
    console.error(e)
    notifyError("events.food_remains.loadError")
  }
}

function onEdit() {

}

watch(
  [selectedFacility],
  () => {
    if (currentPage.value === 0) {
      loadFoodRemainsData()
    } else {
      currentPage.value = 0
    }
  }
)

watch(currentPage, () => {
  loadFoodRemainsData()
})
</script>

<template>
  <h1 class="title">
    {{ $t("events.food_remains.pagetitle") }}
  </h1>

  <Alert type="info">
    {{ $t("events.food_remains.info") }}
  </Alert>

  <FacilitySelect
    v-model="selectedFacility"
    label="general.facility"
    :show-all-option="true"
  />

  <template v-if="remains.length > 0">
    <FoodRemainsOverviewCard
      v-for="remain in remains"
      :key="remain.ID"
      :remains="remain"
      @edit="onEdit"
    />
  </template>
  <template v-else>
    <Card class="text-center">
      {{ $t("general.no_data") }}
    </Card>
  </template>
</template>