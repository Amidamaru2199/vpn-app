import { ref } from 'vue'

// Глобальное состояние для userId (singleton)
const user = ref(null)
const userId = ref(null)

export function useTelegram() {
    const tg = window.Telegram?.WebApp

    const initTelegram = () => {
        if (tg) {
            const telegramUser = tg.initDataUnsafe?.user
            if (telegramUser) {
                user.value = telegramUser
                userId.value = telegramUser.id
            }
            else {
                userId.value = 1024324171 // Fallback для разработки
            }

            tg.expand()
        }
        else {
            userId.value = 1024324171 // Fallback когда Telegram WebApp API недоступен
        }
    }

    // Метод для установки userId извне (для fallback с URL параметром)
    const setUserId = (id) => {
        if (id) {
            userId.value = id
        }
    }

    const showBackButton = (callback) => {
        if (tg) {
            tg.BackButton.show()
            if (callback) {
                tg.BackButton.onClick(callback)
            }
        }
    }

    const hideBackButton = () => {
        if (tg) {
            tg.BackButton.hide()
        }
    }

    const showMainButton = (text, callback) => {
        if (tg) {
            tg.MainButton.setText(text)
            tg.MainButton.show()
            if (callback) {
                tg.MainButton.onClick(callback)
            }
        }
    }

    const hideMainButton = () => {
        if (tg) {
            tg.MainButton.hide()
        }
    }

    const closeTelegram = () => {
        if (tg) {
            tg.close()
        }
    }

    const enableSettingsButton = (callback) => {
        if (tg && tg.SettingsButton) {
            tg.SettingsButton.show()
            if (callback) {
                tg.SettingsButton.onClick(callback)
            }
        }
    }

    const hideSettingsButton = () => {
        if (tg && tg.SettingsButton) {
            tg.SettingsButton.hide()
        }
    }

    return {
        tg,
        user,
        userId,
        initTelegram,
        setUserId,
        showBackButton,
        hideBackButton,
        showMainButton,
        hideMainButton,
        closeTelegram,
        enableSettingsButton,
        hideSettingsButton
    }
}

