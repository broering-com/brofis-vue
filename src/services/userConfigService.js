// src/services/userConfigService.js
import { ref, computed } from 'vue'
import { httpClient } from './httpClient'

const userConfigState = ref(null)
const loadingState = ref(false)
const errorState = ref(null)

// Endpunkt: passe den Pfad an deine API an
const USER_CONFIG_PATH = '/userConfig'

async function fetchUserConfig() {
    loadingState.value = true
    errorState.value = null

    try {
        const data = await httpClient.get(USER_CONFIG_PATH)
        userConfigState.value = data
        return { success: true, data }
    } catch (error) {
        errorState.value = error
        return { success: false, error }
    } finally {
        loadingState.value = false
    }
}

// Optional: z. B. wenn du ein Update-Endpoint hast
async function updateUserConfig(partialConfig) {
    loadingState.value = true
    errorState.value = null

    try {
        // z. B. PATCH auf denselben Endpunkt
        const updated = await httpClient.patch(USER_CONFIG_PATH, partialConfig)

        // Lokalen State updaten (mergen)
        userConfigState.value = {
            ...(userConfigState.value || {}),
            ...updated,
        }

        return { success: true, data: updated }
    } catch (error) {
        errorState.value = error
        return { success: false, error }
    } finally {
        loadingState.value = false
    }
}

// Composable – wie ein „Observable + getValue“ in Angular
export function useUserConfig() {
    return {
        userConfig: computed(() => userConfigState.value),
        isUserConfigLoading: computed(() => loadingState.value),
        userConfigError: computed(() => errorState.value),
        refreshUserConfig: fetchUserConfig,
        updateUserConfig,
    }
}

// Optional: für Stellen ohne Composition API (z. B. Router)
export const userConfigService = {
    fetchUserConfig,
    updateUserConfig,
    getUserConfig: () => userConfigState.value,
}
