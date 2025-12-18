// src/services/authService.js
import { ref, computed } from 'vue'
import { httpClient } from './httpClient'
import { userConfigService } from "@/services/userConfigService.js";
import { catalogService } from "@/services/catalogService.js";
import { notificationService } from "@/services/notificationService.js";

const { clearCatalog } = catalogService
const { post } = httpClient
const { notifySuccess } = notificationService

// Reaktiver Auth-Status
const isAuthenticatedState = ref(
    !!(localStorage.getItem('token')) || !!(sessionStorage.getItem('token'))
)

// Optional: User-Infos speichern
const currentUser = ref(null)

// HILFSFUNKTION: Daten nach erfolgreichem Login setzen
function setSession(data, stayLoggedIn = false) {
    const token = data?.token

    if (!token) {
        throw new Error('Kein Token in der Login-Antwort gefunden.')
    }

    if(stayLoggedIn) {
        localStorage.setItem('token', token)
    } else {
        sessionStorage.setItem('token', token)
    }
    isAuthenticatedState.value = true

    if (data.user) {
        currentUser.value = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
    }
}

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

async function login(username, password, stayLoggedIn = false) {
    if (!username || !password) {
        return { success: false, message: 'Bitte Benutzername und Passwort eingeben.' }
    }

    try {
        const data = await post('/auth/login', {
            name: username,
            password,
        })

        setSession(data, stayLoggedIn)
        await userConfigService.fetchUserConfig()
        await catalogService.ensureCatalogUpToDate()

        return { success: true, data }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Login fehlgeschlagen.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function logout() {
    try {
        await post('auth/logout')

        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        localStorage.removeItem('user')
        clearCatalog('dynamic')
        isAuthenticatedState.value = false
        currentUser.value = null
        userConfigService.clearUserConfig()
        notifySuccess('auth.logout.success')
    } catch (error) {
        console.error('Logout fehlgeschlagen:', error)
    }
}

function isAuthenticated() {
    const hasToken = !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
    isAuthenticatedState.value = hasToken
    return hasToken
}

// Für Komponenten (setup)
export function useAuth() {
    return {
        isAuthenticated: computed(() => isAuthenticatedState.value),
        currentUser: computed(() => currentUser.value),
        login,
        logout,
    }
}

// Für Router usw.
export const authService = {
    login,
    logout,
    isAuthenticated,
    getUser: () => currentUser.value,
}
