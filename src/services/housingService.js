// src/services/authService.js
import {ref} from 'vue'
import {httpClient} from './httpClient'


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

// --- Public API ---

async function getHousingData(house, page = 0, flockNumber = '') {

    try {
        const params = {
            page,
        }
        if (flockNumber) {
            params.flockNumber = flockNumber
        }
        if (house) {
            params.house = house
        }

        let response = await httpClient.get('/housing', {
            params: params
        })

        return {success: true, data: response}
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function duplicateHousingData(housingdata, targets) {
    try {
        let house = housingdata?.Stall
        let date = housingdata?.Datum
        let response = await httpClient.put(`/housing/${house}/${date}`, targets)

        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Löschen der Einstallungsdaten',
            status: error.status,
            raw: error.data
        }
    }
}

async function deleteHousingData(housingdata) {
    try {
        let house = housingdata?.Stall
        let date = housingdata?.Datum
        let response = await httpClient.delete(`/housing/${house}/${date}`)

        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Löschen der Einstallungsdaten',
            status: error.status,
            raw: error.data
        }
    }
}

async function getHousingDetailsData(house, date) {
    try {
        let response
        if (house && date) {
            response = await httpClient.get(`/housing/${house}/${date}`)
        } else if (date) {
            response = await httpClient.get(`/housing/${date}`)
        } else {
            response = await httpClient.get('/housing')
        }

        return {success: true, data: response}
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function putHousingDetailsData(house, date, data) {
    try {
        let response = await httpClient.put(`/housing/${house}/${date}`, data)
        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}


// Für Komponenten (setup)
export function useHousingService() {
    return {
        getHousingData,
        duplicateHousingData,
        deleteHousingData,
        getHousingDetailsData,
        putHousingDetailsData
    }
}

// Für Router usw.
export const housingService = {
    getHousingData,
    duplicateHousingData,
    deleteHousingData,
    getHousingDetailsData,
    putHousingDetailsData
}
