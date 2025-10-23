import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

export function useToast() {
    const show = (message, type = 'info', duration = 3000) => {
        const id = idCounter++
        const toast = {
            id,
            message,
            type,
            duration,
            visible: true
        }
        
        toasts.value.push(toast)
        
        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }
        
        return id
    }

    const remove = (id) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
            toasts.value.splice(index, 1)
        }
    }

    const success = (message, duration = 3000) => {
        return show(message, 'success', duration)
    }

    const error = (message, duration = 4000) => {
        return show(message, 'error', duration)
    }

    const warning = (message, duration = 3000) => {
        return show(message, 'warning', duration)
    }

    const info = (message, duration = 3000) => {
        return show(message, 'info', duration)
    }

    const modal = (message, duration = 0) => {
        return show(message, 'modal', duration)
    }

    const clear = () => {
        toasts.value = []
    }

    return {
        toasts,
        show,
        remove,
        success,
        error,
        warning,
        info,
        modal,
        clear
    }
}

