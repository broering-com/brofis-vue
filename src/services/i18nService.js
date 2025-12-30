import { ref, computed } from 'vue'
import { httpClient } from './httpClient'

// aktuelle Sprache & Messages (global, shared state)
const currentLanguage = ref('de')
const messages = ref({})
const loading = ref(false)
const error = ref(null)

const MESSAGES_BASE_PATH = '/messages' // dein Endpoint: /messages/{language}

/**
 * Lädt Messages für eine bestimmte Sprache vom Backend.
 */
async function loadMessages(lang) {
    loading.value = true
    error.value = null

    try {
        const data = await httpClient.get(`${MESSAGES_BASE_PATH}/${lang}`)
        // Erwartetes Format: { "login.title": "Anmelden", ... }
        messages.value = data || {}
        currentLanguage.value = lang
        return { success: true, data }
    } catch (err) {
        error.value = err
        return { success: false, error: err }
    } finally {
        loading.value = false
    }
}

/**
 * Übersetzungsfunktion – ähnlich wie |trans in Twig.
 * Falls Key nicht gefunden wird, geben wir den Key selbst zurück.
 * Optional: Primitive Parameterinterpolation.
 */
function translate(key, params = {}) {
    if (!key) return ''

    const msg = messages.value[key] ?? key

    // einfache Platzhalter: "Hallo {name}"
    return Object.entries(params).reduce((acc, [pKey, pValue]) => {
        return acc.replaceAll(new RegExp(`{${pKey}}`, 'g'), String(pValue))
    }, msg)
}

export function useI18n() {
    return {
        t: translate,
        currentLanguage: computed(() => currentLanguage.value),
        isI18nLoading: computed(() => loading.value),
        i18nError: computed(() => error.value),
        loadMessages, // Sprache wechseln & neu laden
    }
}

// Für Stellen außerhalb von Komponenten (z. B. main.js)
export const i18nService = {
    t: translate,
    loadMessages,
    getCurrentLanguage: () => currentLanguage.value,
}
