// src/services/authService.js
import { ref } from 'vue'
import { httpClient } from './httpClient'
import { notificationService } from '@/services/notificationService.js'


// Optional: User-Infos speichern
const currentUser = ref(null)

// HILFSFUNKTION: Daten nach erfolgreichem Login setzen
/*function setSession(data, stayLoggedIn = false) {
    const token = data?.token

    if (!token) {
        throw new Error('Kein Token in der Login-Antwort gefunden.')
    }

    if (!stayLoggedIn) {
        sessionStorage.setItem('token', token)
    } else {
        localStorage.setItem('token', token)
    }

    if (data.user) {
        currentUser.value = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
    }
}*/

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

async function getJournalData(house, date) {
    if (!house || !date) {
        return { success: false, message: 'Es wurde kein Haus oder kein Datum angegeben.' }
    }

    try {
        const data = await httpClient.get(`/journal/${house}/${date}`)

        return { success: true, data }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Journaldaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function putJournalData(house, date, data) {
    if (!house || !date) {
        return { success: false, message: 'Es wurde kein Haus oder kein Datum angegeben.' }
    }
    try {
        const response = await httpClient.put(`/journal/${house}/${date}`, data)
        notificationService.notifySuccess('journal.submit.success')
        return { success: true, data: response }
    } catch (error) {
        notificationService.notifyError(error.message || 'Fehler beim Speichern der Journaldaten.')
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Journaldaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

// Für Komponenten (setup)
export function useJournalService() {
    return {
        getJournalData,
        putJournalData
    }
}

// Für Router usw.
export const journalService = {
    getJournalData,
    putJournalData
}
