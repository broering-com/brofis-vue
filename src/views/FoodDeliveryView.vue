<script setup>

import HouseSelect from "@/components/HouseSelect.vue";
import Alert from "@/components/utils/Alert.vue";
</script>

<template>
  <h1 class="title">
    {{ $t("events.foodDeliveries.pagetitle") }}
  </h1>

  <RouterLink
    class="btn btn-primary"
    type="button"
    :to="{ name: 'foodDeliveryDetails' }"
  >
    {{ $t("events.harvests.add") }}
  </RouterLink>

  <Alert
    type="info"
    class="my-4"
  >
    {{ $t("events.harvests.info") }}
  </Alert>

  <div class="row">
    <HouseSelect
      v-model="selectedHouse"
      :show-all-option="true"
    />
  </div>
</template>