import { ref } from 'vue'

export function useTelegram() {
    const tg = window.Telegram?.WebApp
    const user = ref(null)
    const userId = ref(null)

    const initTelegram = () => {
        if (tg) {
            const telegramUser = tg.initDataUnsafe?.user
            if (telegramUser) {
                user.value = telegramUser
                userId.value = telegramUser.id
            } else {
                userId.value = 1024324171
            }

            tg.expand()
        } else {
            userId.value = 1024324171
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
        showBackButton,
        hideBackButton,
        showMainButton,
        hideMainButton,
        closeTelegram,
        enableSettingsButton,
        hideSettingsButton
    }
}

