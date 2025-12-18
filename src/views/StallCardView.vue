<script setup>
  import HouseSelect from "@/components/HouseSelect.vue";
  import HousingSelect from "@/components/events/HousingSelect.vue";
  import { computed, ref, watch } from "vue";
  import { useStallCardService } from "@/services/stallCardService";
  import BaseDropdown from "@/components/utils/BaseDropdown.vue";
  import ComplexTableHead from "@/components/tables/ComplexTableHead.vue";
  import { STALL_CARD_TABLE_HEAD_OBJECT_TREE } from "@/constants/StallCardTableHeadObjectTree.js";
  import { flattenColumns } from "@/services/flattenColumns.js";
  import BaseModal from "@/components/utils/BaseModal.vue";
  import ColumnVisibilityModalContent from "@/components/tables/ColumnVisibilityModalContent.vue";

  const { getStallCardData, exportFirstWeekReport } = useStallCardService();

  const selectedHouse = ref("");
  const selectedHousing = ref("");
  const tableRows = ref([]);

  // Modal + Column selection state
  const showColumnModalOpen = ref(false);
  const columnContentRef = ref(null);

  const headerTree = STALL_CARD_TABLE_HEAD_OBJECT_TREE;

  // ✅ einheitliche Namen
  const allColumns = computed(() => flattenColumns(headerTree));
  const hiddenKeys = ref(new Set()); // Leaf keys die ausgeblendet sind

  const visibleColumns = computed(() =>
  allColumns.value.filter((c) => !hiddenKeys.value.has(c.key))
  );

  async function loadStallCardData() {
  const response = await getStallCardData(selectedHouse.value, selectedHousing.value);
  tableRows.value = response.data;
}

  async function startExportFirstWeekReport() {
  await exportFirstWeekReport(selectedHouse.value, selectedHousing.value);
}

  // ✅ Apply/Confirm: übernimmt Auswahl aus Content
  function onConfirmColumnModal() {
  columnContentRef.value?.apply?.(); // ColumnVisibilityModalContent exposed apply()
  showColumnModalOpen.value = false;
}

  function onShowColumnClose() {
  // optional: nix nötig – BaseModal schließt schon via v-model
}

  watch([selectedHouse, selectedHousing], () => {
  if (selectedHouse.value && selectedHousing.value) {
  loadStallCardData();
}
});
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
        @click="showColumnModalOpen = true"
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
          <button
            class="dropdown-item"
            type="button"
            @click="startExportFirstWeekReport"
          >
            7 Tage Report
          </button>
        </li>
      </base-dropdown>
    </div>
  </div>
  <div class="col-12 overflow-x-scroll mt-3">
    <table class="stallkarte mx-3 w-100">
      <colgroup>
        <col
          v-for="col in visibleColumns"
          :key="col.key"
          :class="col.class"
          :style="{ width: col.width }"
          :data-default-width="col.defaultWidth"
        >
      </colgroup>
      <ComplexTableHead
        :header-tree="headerTree"
        :hidden-keys="hiddenKeys"
      />
      <tbody>
        <!-- tr nur exemplarisch -->
        <tr
          v-for="n in 30"
          :key="n"
          :class="{ 'seven-day-interval': n % 7 === 0 }"
        >
          <td>{{ n }}.01.26</td>
          <td>{{ n }}</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>25900</td>
          <td>Keine Bemerkung</td>
          <td>27</td>
          <td>26,5</td>
          <td>28</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>08:00 / 08:00 / 08:00</td>
          <td>1</td>
        </tr>
      </tbody>
      <ComplexTableHead
        :header-tree="headerTree"
        :hidden-keys="hiddenKeys"
        mode="foot"
      />
    </table>
  </div>

  <BaseModal
    v-model="showColumnModalOpen"
    title="stallCard.showColumnModal.title"
    size="lg"
    @confirm="onConfirmColumnModal"
    @close="onShowColumnClose"
  >
    <ColumnVisibilityModalContent
      ref="columnContentRef"
      :columns="allColumns"
      :hidden-keys="hiddenKeys"
      @update:hidden-keys="hiddenKeys = $event"
    />

    <template #footer>
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="showColumnModalOpen = false"
      >
        {{ $t('general.cancel') }}
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="onConfirmColumnModal"
      >
        {{ $t('general.submit') }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.stallkarte {
  line-height: 1;
  table-layout: fixed;
  display: inline-table;

  --standard-background-alpha: 0.1;
  --highlight-background-alpha: 0.25;
}

.stallkarte > tbody > tr > td {
  border: 1px solid grey;
  text-align: center;
  padding: 0.3rem 0.1rem;
  overflow: hidden;
}

.stallkarte > thead > tr:first-child > th {
  width: 0;
  padding-left: 0;
  padding-right: 0;
}

.stallkarte > thead > tr > th,
.stallkarte > tfoot > tr > td {
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  background: lightgrey !important;
  border: 1px solid grey !important;
  padding: 0.3rem 0.1rem;
  overflow: hidden;
}

/* Hilfsklassen (kannst du in TD/TH setzen) */
/*.seven-day-interval {
  background: #E8E8E8;
}*/

.border-r {
  border-right: 2px black double;
}

.col-tiere { background: rgba(238, 22, 31, var(--standard-background-alpha)); }
.col-tiere.soll { background: rgba(238, 22, 31, var(--highlight-background-alpha)); }

.col-klima { background: rgba(0, 168, 80, var(--standard-background-alpha)); }
.col-klima.soll { background: rgba(0, 168, 80, var(--highlight-background-alpha)); }

.col-wasser { background: rgba(0, 155, 189, var(--standard-background-alpha)); }
.col-wasser.soll { background: rgba(0, 155, 189, var(--highlight-background-alpha)); }

.col-futter { background: rgba(247, 149, 24, var(--standard-background-alpha)); }
.col-futter.soll { background: rgba(247, 149, 24, var(--highlight-background-alpha)); }

.col-gewicht { background: rgba(149, 40, 97, var(--standard-background-alpha)); }
.col-gewicht.soll { background: rgba(149, 40, 97, var(--highlight-background-alpha)); }

/* Wenn du die Summenreihe ebenfalls in der Komponente hast: */
.sum-row {
  border-top: 3px double black;
}

</style>
