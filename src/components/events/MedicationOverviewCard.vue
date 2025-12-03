<script setup>

import Card from "@/components/ui/Card.vue";

const {medication} = defineProps(
    {
      medication: {
        type: Object,
        required: true,
      },
    }
)

const emit = defineEmits(["duplicate", "edit", "delete"])
function onDuplicateClick() {
  emit("duplicate", medication)
}
function onDeletionClick() {
  emit("delete", medication)
}

function onEditClick() {
  emit("edit", medication)
}
</script>

<template>
  <Card>
    <div class="row">
      <div class="col-6 col-md-4 col-lg-2 fw-bold center-vertical">
        {{ medication.Datum }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical my-lg-3">
        {{ medication.Stall }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ medication.Art ?? '-' }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ medication.Produkt ?? '-' }}
      </div>
      <div class="col-12 col-md-12 col-lg-4 text-end">
        <button
          class="btn btn-primary my-1 mx-1 "
          type="button"
          @click="onDuplicateClick"
        >
          {{ $t('general.duplicate') }}
        </button>
        <button
          class="btn btn-primary my-1 mx-1"
          type="button"
          @click="onEditClick"
        >
          {{ $t('general.edit') }}
        </button>
        <button
          class="btn btn-outline-danger my-1 ms-1"
          type="button"
          @click="onDeletionClick"
        >
          {{ $t('general.delete') }}
        </button>
      </div>
    </div>
  </Card>
</template>

<style scoped>

</style>