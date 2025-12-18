<script setup>
import { computed, ref, watch, defineExpose } from "vue";
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue"; // Pfad ggf. anpassen

const props = defineProps({
  columns: { type: Array, required: true }, // [{ key, label, labelKey?, group? }]
  hiddenKeys: { type: [Array, Set], default: () => new Set() },
});

const emit = defineEmits(["update:hiddenKeys"]);

const localHidden = ref(new Set());
const query = ref("");

watch(
  () => props.hiddenKeys,
  (v) => {
    localHidden.value = v instanceof Set ? new Set(v) : new Set(v ?? []);
  },
  { immediate: true }
);

const filteredColumns = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.columns;

  return props.columns.filter((c) => {
    const label = String(c.label ?? "").toLowerCase();
    const key = String(c.key ?? "").toLowerCase();
    const group = String(c.group ?? "").toLowerCase();
    const labelKey = String(c.labelKey ?? "").toLowerCase();
    return label.includes(q) || key.includes(q) || group.includes(q) || labelKey.includes(q);
  });
});

const visibleCount = computed(() => props.columns.length - localHidden.value.size);
const canHideMore = computed(() => visibleCount.value > 1);

function showAll() {
  localHidden.value = new Set();
}

function setVisible(key, nextVisible) {
  const s = new Set(localHidden.value);

  if (nextVisible) {
    s.delete(key);
  } else {
    if (!canHideMore.value) return; // letzte sichtbare Spalte nicht ausblenden
    s.add(key);
  }

  localHidden.value = s;
}

function toggleByKey(key) {
  const currentlyVisible = !localHidden.value.has(key);
  setVisible(key, !currentlyVisible);
}

function apply() {
  if (localHidden.value.size >= props.columns.length && props.columns.length) {
    localHidden.value.delete(props.columns[0].key);
  }
  emit("update:hiddenKeys", new Set(localHidden.value));
}

defineExpose({ apply });
</script>

<template>
  <div class="cvc-toolbar">
    <input
      v-model="query"
      class="cvc-search form-control form-control-sm"
      type="text"
      placeholder="Suchen… (z.B. Temperatur, Verluste, g)"
    >

    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      @click="showAll"
    >
      {{ $t("general.show_all") }}
    </button>
  </div>

  <div
    v-if="!canHideMore"
    class="cvc-hint"
  >
    {{ $t("tables.column_visibility_modal.at_least_one_column_visible") }}
  </div>

  <div class="cvc-list">
    <div
      v-for="c in filteredColumns"
      :key="c.key"
      class="cvc-item"
      :class="{ disabled: !localHidden.has(c.key) && !canHideMore }"
      @click.self="toggleByKey(c.key)"
    >
      <!-- BaseCheckbox: exakt nach deiner API -->
      <BaseCheckbox
        :model-value="!localHidden.has(c.key)"
        :disabled="!localHidden.has(c.key) && !canHideMore"
        :container-classes="'mb-0'"
        :label="c.labelKey || ''"
        @update:model-value="(val) => setVisible(c.key, val)"
      />

      <!-- Fallback-Label, wenn kein i18n-key vorhanden -->
      <div
        v-if="!c.labelKey"
        class="cvc-text"
        @click="toggleByKey(c.key)"
      >
        <div class="cvc-item-label">
          {{ c.label ?? c.key }}
        </div>
        <div
          v-if="c.group"
          class="cvc-item-sub"
        >
          {{ c.group }}
        </div>
      </div>

      <!-- Wenn labelKey vorhanden ist, hängt das Label in BaseCheckbox.
           Optional zeigen wir group trotzdem rechts daneben -->
      <div
        v-else-if="c.group"
        class="cvc-text"
        @click="toggleByKey(c.key)"
      >
        <div class="cvc-item-sub">
          {{ c.group }}
        </div>
      </div>
    </div>
  </div>

  <div class="cvc-footerline">
    {{ $t("general.visible") }}: <b>{{ visibleCount }}</b> / {{ columns.length }}
  </div>
</template>

<style scoped>
.cvc-toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.cvc-search {
  flex: 1;
}

.cvc-hint {
  font-size: 0.85rem;
  opacity: 0.85;
  margin-bottom: 0.75rem;
}

.cvc-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .cvc-list {
    grid-template-columns: 1fr;
  }
}

.cvc-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.5rem 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}

.cvc-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cvc-text {
  min-width: 0;
  padding-top: 0.1rem;
  cursor: pointer;
}

.cvc-item-label {
  font-size: 0.95rem;
}

.cvc-item-sub {
  font-size: 0.8rem;
  opacity: 0.7;
}

.cvc-footerline {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  opacity: 0.85;
}
</style>
