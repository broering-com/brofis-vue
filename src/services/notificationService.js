// src/services/notificationService.js
import { ref, computed } from 'vue'

const notifications = ref([]) // [{ id, type, message }]
let idCounter = 0

function addNotification({ type = 'info', message, timeout = 5000 }) {
    const id = ++idCounter
    notifications.value.push({ id, type, message })

    if (timeout > 0) {
        setTimeout(() => {
            removeNotification(id)
        }, timeout)
    }

    return id
}

function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
}

function clearNotifications() {
    notifications.value = [];
}

function notifySuccess(message, timeout = 5000) {
    return addNotification({ type: 'success', message, timeout })
}

function notifyError(message, timeout = 0) {
    return addNotification({ type: 'danger', message, timeout })
}

function notifyInfo(message, timeout = 0) {
    return addNotification({ type: 'info', message, timeout })
}

export function useNotifications() {
    return {
        notifications: computed(() => notifications.value),
        removeNotification,
        notifySuccess,
        notifyError,
        notifyInfo,
        clearNotifications,
    }
}

export const notificationService = {
    notifySuccess,
    notifyError,
    notifyInfo,
    removeNotification,
    clearNotifications,
}
