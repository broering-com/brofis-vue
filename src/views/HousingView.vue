<script setup>

import Alert from "@/components/utils/Alert.vue";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import {onMounted, ref, watch} from "vue";
import {useHousingService} from "@/services/housingService";
import {useNotifications} from "@/services/notificationService"
import HousingOverviewCard from "@/components/events/HousingOverviewCard.vue";
import Pagination from "@/components/utils/Pagination.vue";
import Card from "@/components/ui/Card.vue";

const {getHousingData} = useHousingService()
const {notifyError} = useNotifications()

const selectedHouse = ref('')
const flockNumber = ref('')
const currentPage = ref(0)

const housings = ref([])

async function loadHousingData() {
  const house = selectedHouse.value !== 'all' ? selectedHouse.value : null
  const result = await getHousingData(house, currentPage.value, flockNumber.value);

  if (result.success) {
    housings.value = result.data;
  } else {
    notifyError(result.message)
  }
}

watch([selectedHouse, flockNumber], () => {
  currentPage.value = 0
  loadHousingData()
},)

watch(currentPage, () => {
  loadHousingData()
})

</script>

<template>
  <h1 class="title">
    {{ $t('events.housings.pagetitle') }}
  </h1>
  <RouterLink
    class="btn btn-primary"
    type="button"
    :to="{name: 'housingDetails'}"
  >
    {{ $t('events.housings.add') }}
  </RouterLink>
  <Alert
    type="info"
    class="my-4"
  >
    {{ $t('events.housings.info') }}
  </Alert>

  <div class="row">
    <HouseSelect
      v-model="selectedHouse"
      class="col-6"
      :show-all-option="true"
    />
    <BaseInput
      v-model="flockNumber"
      label="events.housings.herd"
      class="col-6"
    />
  </div>

  <template v-if="housings.length > 0">
    <HousingOverviewCard
      v-for="housing in housings"
      :key="housing.ID"
      :housing="housing"
    />
  </template>
  <template v-else>
    <Card class="text-center">
      {{ $t('general.no_data') }}
    </Card>
  </template>

  <Pagination
    v-model:current-page="currentPage"
    :last-page="15"
    :items-per-page="15"
  />
</template>
