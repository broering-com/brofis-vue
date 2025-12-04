<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String, // "sm", "lg", "xl"
    default: "",
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "close", "confirm"]);

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const dialogClass = computed(() => {
  return [
    "modal-dialog",
    props.size && `modal-${props.size}`,
  ].filter(Boolean).join(" ");
});

function close() {
  show.value = false;
  emit("close");
}

function confirm() {
  emit("confirm");
}

function onBackdropClick(e) {
  if (!props.closeOnBackdrop) return;
  if (e.target.classList.contains("modal")) {
    close();
  }
}

function onKeydown(e) {
  if (!props.closeOnEsc) return;
  if (e.key === "Escape" && show.value) {
    close();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <!-- Teleport rendert element an to-Element (in diesem Fall body) -->
  <Teleport to="body">
    <!-- Backdrop + Modal nur rendern wenn show -->
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="modal fade show"
        tabindex="-1"
        style="display: block;"
        role="dialog"
        aria-modal="true"
        @click="onBackdropClick"
      >
        <div :class="dialogClass">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <slot name="title">
                  {{ $t(title) }}
                </slot>
              </h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                @click="close"
              />
            </div>

            <div class="modal-body">
              <slot />
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="close"
                >
                  Schließen
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="confirm"
                >
                  OK
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition name="backdrop-fade">
      <div
        v-if="show"
        class="modal-backdrop fade show"
      />
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal-Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease-out, transform 0.15s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Backdrop-Transition */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.backdrop-fade-enter-to,
.backdrop-fade-leave-from {
  opacity: 0.5; /* kannst du anpassen */
}

/* falls Bootstrap die Backdrop-Opacity erwartet */
/*.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}*/
</style>
