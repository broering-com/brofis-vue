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
        let response = await httpClient.get(`${FIRST_WEEK_REPORT}/${house}/${housing}`, { responseType: 'blob' })
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

// Für Komponenten (setup)
export function useStallCardService() {
    return {
        getStallCardData,
        exportFirstWeekReport,
    }
}

// Für Router usw.
export const stallCardService = {
    getStallCardData,
    exportFirstWeekReport,
}
