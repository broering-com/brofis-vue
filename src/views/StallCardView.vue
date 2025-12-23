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

const {
  getStallCardData,
  exportFirstWeekReport,
  exportMedicationReport,
  exportLivestockMigrationExport,
  exportStallCardCsv,
  exportVKIReport,
  // exportFinancialAnalysisReport,
  exportCardReport,
  exportPeriodReport
} = useStallCardService();

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

async function startExportMedicationReport() {
  await exportMedicationReport(selectedHouse.value, selectedHousing.value)
}

async function startExportVerboseMedicationReport() {
  await exportMedicationReport(selectedHouse.value, selectedHousing.value, true)
}

async function startExportLivestockMigrationExport() {
  await exportLivestockMigrationExport(selectedHouse.value)
}

async function startExportStallCardCSV() {
  await exportStallCardCsv(selectedHouse.value, selectedHousing.value)
}

async function startExportVKIReport() {
  // TODO UNTERSCHRIFT!
  // PAYLOAD: { signature: "data:image/png;base64;...." || null }
  const signature = { signature: null }
  await exportVKIReport(selectedHouse.value, selectedHousing.value, signature)
}

async function startExportFinancialFeedingEvaluation() {
  // TODO MODAL FÜR ANFRAGE
  // PAYLOAD: { periods: [{house: "Mustermann-1", housingDate: "2025-12-15"}] }
  // const response = await exportFinancialAnalysisReport(payloadAusModal)
}

async function startExportStallCardPdf() {
  // TODO SIGNATURE
  // Payload { signature: "data:image/png;base64;...." }
  // const resposne = await exportCardReport(selectedHouse.value, selectedHousing.value, signature)
  const signature = { signature: "data:image/png;base64,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" }
  await exportCardReport(selectedHouse.value, selectedHousing.value, signature)
}

async function startExportRaiseAndFeedingReport() {
  const signature = {
    signature: null
  }
  await exportPeriodReport(selectedHouse.value, selectedHousing.value, signature)
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
        title="{{$t('stall_card.filter.title')}}"
        @click="showColumnModalOpen = true"
      >
        Filter
      </button>
      <button
        class="btn btn-primary mx-1"
        type="button"
        title="{{$t('stall_card.filter.title')}}"
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
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportMedicationReport"
          >
            Bestandsbuch Medikation
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportVerboseMedicationReport"
          >
            Erweitertes Bestandsbuch
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportLivestockMigrationExport"
          >
            Tierbewegung (HIT / TAM)
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportStallCardCSV"
          >
            Stallkarte (CSV)
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportVKIReport"
          >
            VKI Bericht
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportFinancialFeedingEvaluation"
          >
            Finanzielle Mastauswertung
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportStallCardPdf"
          >
            Stallkarte
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="startExportRaiseAndFeedingReport"
          >
            Aufzucht- und Mastbericht
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
      translation-prefix="stall_card"
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

.border-r {
  border-right: 2px black double;
}

.col-tiere {
  background: rgba(238, 22, 31, var(--standard-background-alpha));
}

.col-tiere.soll {
  background: rgba(238, 22, 31, var(--highlight-background-alpha));
}

.col-klima {
  background: rgba(0, 168, 80, var(--standard-background-alpha));
}

.col-klima.soll {
  background: rgba(0, 168, 80, var(--highlight-background-alpha));
}

.col-wasser {
  background: rgba(0, 155, 189, var(--standard-background-alpha));
}

.col-wasser.soll {
  background: rgba(0, 155, 189, var(--highlight-background-alpha));
}

.col-futter {
  background: rgba(247, 149, 24, var(--standard-background-alpha));
}

.col-futter.soll {
  background: rgba(247, 149, 24, var(--highlight-background-alpha));
}

.col-gewicht {
  background: rgba(149, 40, 97, var(--standard-background-alpha));
}

.col-gewicht.soll {
  background: rgba(149, 40, 97, var(--highlight-background-alpha));
}

/* Wenn du die Summenreihe ebenfalls in der Komponente hast: */
.sum-row {
  border-top: 3px double black;
}
</style>
