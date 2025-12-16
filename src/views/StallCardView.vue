<script setup>

import HouseSelect from "@/components/HouseSelect.vue";
import HousingSelect from "@/components/events/HousingSelect.vue";
import { ref, watch } from "vue";
import { useStallCardService } from "@/services/stallCardService";
import BaseDropdown from "@/components/utils/BaseDropdown.vue";

const { getStallCardData } = useStallCardService()

const selectedHouse = ref("")
const selectedHousing = ref("")
const tableRows = ref([])

async function loadStallCardData() {
  const response = await getStallCardData(selectedHouse.value, selectedHousing.value)
  tableRows.value = response.data;
}

watch(
  [selectedHouse, selectedHousing],
  () => {
    if (selectedHouse.value && selectedHousing.value) {
      loadStallCardData()
    }
  }
)
</script>

<template>
  <div class="row">
    <HouseSelect
      v-model="selectedHouse"
      classes="col-6 mb-1"
    />
    <HousingSelect
      v-model="selectedHousing"
      classes="col-6 mb-1"
      :selected-house="selectedHouse"
      :has-all-option="false"
    />
  </div>

  <div class="row">
    <div class="d-inline-block">
      <button
        class="btn btn-primary mx-1"
        type="button"
        title="{{$t('stallCard.filter.title')}}"
      >
        Filter
      </button>
      <button
        class="btn btn-primary mx-1"
        type="button"
        title="{{$t('stallCard.filter.title')}}"
      >
        Bereinigen
      </button>
      <base-dropdown
        class="d-inline-block"
        label="stallCard.actions.title"
        btn-classes="btn-primary"
      >
        <li>
          A
        </li>
      </base-dropdown>
    </div>
  </div>
</template>
