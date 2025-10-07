import { ref, onMounted } from 'vue'

export function useTelegram() {
    const tg = window.Telegram?.WebApp
    const user = ref(null)
    const userId = ref(null)

    const initTelegram = () => {
        if (tg) {
            // Получаем данные пользователя
            const telegramUser = tg.initDataUnsafe?.user
            
            if (telegramUser) {
                user.value = telegramUser
                userId.value = telegramUser.id
            }

            // Расширяем WebApp на весь экран
            tg.expand()
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

    return {
        tg,
        user,
        userId,
        initTelegram,
        showBackButton,
        hideBackButton,
        showMainButton,
        hideMainButton,
        closeTelegram
    }
}

