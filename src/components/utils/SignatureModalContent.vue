<script setup>
import { VueSignaturePad } from "vue-signature-pad";
import { useTemplateRef } from "vue";

const signaturePad = useTemplateRef("signaturePad");

const emit = defineEmits(['update:signature'])

function clearSignature() {
  signaturePad.value?.clearSignature();
}

function submitSignature() {
  const result = signaturePad.value?.saveSignature();
  emit('update:signature', result.isEmpty ? null : result.data);
}
</script>

<template>
  <VueSignaturePad
    ref="signaturePad"
    width="100%"
    height="300px"
    :custom-style="{ backgroundColor: '#fff5bd' }"
  />
  <div class="modal-footer">
    <button
      type="button"
      class="btn btn-secondary"
      @click="clearSignature"
    >
      {{ $t('general.clear') }}
    </button>
    <button
      type="button"
      class="btn btn-primary"
      @click="submitSignature"
    >
      {{ $t('general.continue') }}
    </button>
  </div>
</template>