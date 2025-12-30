// src/services/authService.js
import { ref } from 'vue'
import { httpClient } from './httpClient'

// Optional: User-Infos speichern
const currentUser = ref(null)


// Bei App-Start evtl. gespeicherten User laden
const storedUser = localStorage.getItem('user')
if (storedUser) {
    try {
        currentUser.value = JSON.parse(storedUser)
    } catch {
        currentUser.value = null
    }
}
const BASE_PATH = '/card'
const FIRST_WEEK_REPORT = '/firstWeekReport'
const MEDICATION_REPORT = '/medicationReport'
const LIVESTOCK_MIGRATION_EXPORT = '/livestockMigrationExport'
const CARD_SPREADSHEET = '/cardSpreadsheet'
const CARD_REPORT = '/cardReport'
const VKI_REPORT = '/vkiReport'
const FINANCIAL_ANALYSIS_REPORT = '/financialAnalysisExport'
const PERIOD_REPORT = '/periodReport/plukon'


// --- Public API ---

async function getStallCardData(house, housing) {

    try {

        let response = await httpClient.get(`${BASE_PATH}/${house}/${housing}`, )

        return { success: true, data: response }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Stallkarte.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportFirstWeekReport(house, housing) {
    try {
        let response = await httpClient.getFile(`${FIRST_WEEK_REPORT}/${house}/${housing}`)
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der ersten Woche.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportMedicationReport(house, housing, verbose = false) {
    try {
        let response = await httpClient.getFile(`${MEDICATION_REPORT}/${house}/${housing}`, { params: { verbose } })
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Medikation.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportLivestockMigrationExport(house) {
    try {
        let response = await httpClient.getFile(`${LIVESTOCK_MIGRATION_EXPORT}/${house}`)
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Livestock Migration.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportStallCardCsv(house, housing) {
    try {
        let response = await httpClient.getFile(`${CARD_SPREADSHEET}/${house}/${housing}`)
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Livestock Migration.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportVKIReport(house, housing, signature) {
    try {
        const options = {
            body: signature,
            headers: { Accept: '*/*' }
        }
        let response = await httpClient.getFile(`${VKI_REPORT}/${house}/${housing}`, options, 'POST')
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Livestock Migration.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportFinancialAnalysisReport(periods) {
    try {
        let response = await httpClient.getFile(`${FINANCIAL_ANALYSIS_REPORT}`, periods, 'POST')
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Finanzanalyse.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportCardReport(house, housing, signature) {
    try {
        const options = {
            body: signature,
            headers: { Accept: '*/*' }
        }
        let response = await httpClient.getFile(`${CARD_REPORT}/${house}/${housing}`, options, 'POST')
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Livestock Migration.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function exportPeriodReport(house, housing, signature) {
    try {
        const options = {
            body: signature,
            headers: { Accept: '*/*' }
        }
        let response = await httpClient.getFile(`${PERIOD_REPORT}/${house}/${housing}`, options, 'POST')
        if (response.success) {
            return { success: true }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Export der Livestock Migration.',
            status: error.status,
            raw: error.data,
        }
    }
}

// Für Komponenten (setup)
export function useStallCardService() {
    return {
        getStallCardData,
        exportFirstWeekReport,
        exportMedicationReport,
        exportLivestockMigrationExport,
        exportStallCardCsv,
        exportVKIReport,
        exportFinancialAnalysisReport,
        exportCardReport,
        exportPeriodReport,
    }
}

// Für Router usw.
export const stallCardService = {
    getStallCardData,
    exportFirstWeekReport,
    exportMedicationReport,
    exportLivestockMigrationExport,
    exportStallCardCsv,
    exportVKIReport,
    exportFinancialAnalysisReport,
    exportCardReport,
    exportPeriodReport,
}
