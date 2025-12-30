// src/services/httpClient.js
import { ref, computed } from 'vue'

const API_PREFIX = '/api/v1'
// const API_PREFIX = '/api/v2'

// 🔥 globaler Request-Zähler
const activeRequests = ref(0)

let httpRouter = null

export function registerHttpRouter(router) {
    httpRouter = router
}

function startRequest() {
    activeRequests.value++
}

function endRequest() {
    // falls mal was schief läuft, nicht unter 0 gehen
    activeRequests.value = Math.max(0, activeRequests.value - 1)
}

// Composable, um den Status in Komponenten zu nutzen
export function useHttpLoading() {
    return {
        isHttpLoading: computed(() => activeRequests.value > 0),
        activeRequests: computed(() => activeRequests.value),
    }
}

function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function buildUrl(path, params) {
    let url = API_PREFIX

    if (path.startsWith('/')) {
        url += path
    } else {
        url += '/' + path
    }

    if (params && typeof params === 'object') {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value))
            }
        })
        const query = searchParams.toString()
        if (query) {
            url += `?${query}`
        }
    }

    return url
}

async function request(method, path, { body, params, headers, parseAs = 'json' } = {}) {
    const url = buildUrl(path, params)
    const token = getAuthToken()

    const isFormData = body instanceof FormData

    const finalHeaders = {
        Accept: 'application/json',
        ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
        ...(headers),
    }

    if (token) finalHeaders.Authorization = `Bearer ${token}`

    const options = {
        method,
        headers: finalHeaders,
        ...(body
            ? isFormData
                ? { body } // <-- wichtig: FormData direkt
                : { body: JSON.stringify(body) }
            : {}),
    }

    startRequest()
    try {
        const response = await fetch(url, options)

        if (response.status === 204) return null

        // Für Datei / raw response: KEIN json() erzwingen
        if (parseAs === 'response') return response

        if (!response.ok) {
            // Fehlertext möglichst robust lesen (JSON oder Text)
            let errData = null
            let message = `Request fehlgeschlagen (Status ${response.status})`

            try {
                errData = await response.clone().json()
                message = errData?.message || errData?.error || message
            } catch {
                try {
                    const txt = await response.clone().text()
                    if (txt) message = txt
                } catch {}
            }

            const error = new Error(message)
            error.status = response.status
            error.data = errData

            if (error.status === 401) {
                localStorage.removeItem('token')
                httpRouter?.push('/')
            }
            throw error
        }

        if (parseAs === 'blob') return await response.blob()
        if (parseAs === 'text') return await response.text()

        // default json
        try {
            return await response.json()
        } catch {
            throw new Error(`Ungültige JSON-Antwort vom Server (Status ${response.status})`)
        }
    } finally {
        endRequest()
    }
}

async function requestFileDownload(path, options = {}, method = 'GET') {
    const response = await request(method, path, { ...options, parseAs: 'response' })

    if (response.status >= 200 && response.status <= 299) {
        const contentType = response.headers.get('Content-Type') || ''
        const contentDisposition = response.headers.get('Content-Disposition') || ''

        let fileName = 'download'
        const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)"?/i)
        if (match?.[1]) fileName = decodeURIComponent(match[1])

        // Fallback Endungen
        if (!fileName.includes('.') && contentType.includes('pdf')) fileName += '.pdf'
        if (!fileName.includes('.') && contentType.includes('csv')) fileName += '.csv'

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()

        setTimeout(() => URL.revokeObjectURL(url), 1000)

        return { success: true }
    } else {
        return { success: false, message: 'Download fehlgeschlagen.' }
    }
}

export const httpClient = {
    get(path, options = {}) {
        return request('GET', path, options)
    },
    post(path, body, options = {}) {
        return request('POST', path, { ...options, body })
    },
    put(path, body, options = {}) {
        return request('PUT', path, { ...options, body })
    },
    patch(path, body, options = {}) {
        return request('PATCH', path, { ...options, body })
    },
    delete(path, options = {}) {
        return request('DELETE', path, options)
    },
    getFile(path, options = {}, method = 'GET') {
        return requestFileDownload(path, options, method)
    },
    postFile(path, fileOrFormData, options = {}) {
        const { fieldName = 'file', ...rest } = options

        let body

        if (fileOrFormData instanceof FormData) {
            // falls du schon selbst ein FormData gebaut hast
            body = fileOrFormData
        } else {
            const formData = new FormData()
            formData.append(fieldName, fileOrFormData)
            body = formData
        }

        return request('POST', path, { ...rest, body })
    },
}
