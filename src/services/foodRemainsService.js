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
const BASE_PATH = '/feedRemain'

// --- Public API ---

async function getFoodRemainsData(facility, page = 0,) {

    try {
        const params = {
            page,
        }
        if (facility) {
            params.facility = facility
        }

        let response = await httpClient.get(BASE_PATH, {
            params: params
        })

        return { success: true, data: response }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Futterlieferungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}



// Für Komponenten (setup)
export function useFoodRemainsService() {
    return {
        getFoodRemainsData,
    }
}

// Für Router usw.
export const foodRemainsService = {
    getFoodRemainsData,
}
