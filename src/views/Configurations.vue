<template>
	<div class="configurations container">
		<h3 class="configurations__title">Настройка VPN на устройстве</h3>
		<p class="configurations__subtitle">Всего пару шагов и можно пользоваться</p>
		<div class="configurations__box">
			<p class="configurations__box-description">1. Скачайте и откройте V2Raytun, а затем вернитесь к текущему экрану</p>
			<button class="configurations__box-button" @click="openAppStore">Скачать</button>
			<p class="configurations__box-description">2. Добавьте подписку в V2Raytun</p>
			<button class="configurations__box-button" @click="installProfile">Добавить</button>
			<p class="configurations__box-description">3. И все! Нажмите на кнопку подключения в V2Raytun и забудьте об ограничениях</p>
		</div>
		<div class="configurations__box">
			<h3 class="configurations__title">Добавить подписку вручную</h3>
			<button class="configurations__box-button" @click="copySubscriptionLink">Скопировать ссылку на подписку</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTelegram } from '../composables/useTelegram'

const { userId, initTelegram, showBackButton } = useTelegram()

// Определение платформы устройства
const currentPlatform = ref('')

// Функция для определения платформы
const detectPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        currentPlatform.value = 'ios'
    }
    else if (/android/i.test(userAgent)) {
        currentPlatform.value = 'android'
    }
    else if (/Macintosh|Mac OS X/.test(userAgent)) {
        currentPlatform.value = 'macos'
    }
}

const isIOS = computed(() => currentPlatform.value === 'ios')
const isAndroid = computed(() => currentPlatform.value === 'android')
const isMacOS = computed(() => currentPlatform.value === 'macos')
const isApplePlatform = computed(() => isIOS.value || isMacOS.value)

// Функция для открытия магазина приложений
const openAppStore = () => {
    if (isApplePlatform.value) {
        window.open('https://apps.apple.com/ru/app/v2raytun/id6476628951', '_blank')
    } else if (isAndroid.value) {
        window.open('https://play.google.com/store/apps/details?id=com.v2raytun.android', '_blank')
    } else {
        const choice = confirm('Выберите магазин приложений:\nOK - App Store (iOS/macOS)\nCancel - Google Play (Android)')
        if (choice) {
            window.open('https://apps.apple.com/ru/app/v2raytun/id6476628951', '_blank')
        } else {
            window.open('https://play.google.com/store/apps/details?id=com.v2raytun.android', '_blank')
        }
    }
}

// Функция для установки профиля в v2Raytun
const installProfile = () => {
    // Проверяем наличие Telegram ID
    if (!userId.value) {
        alert('Ошибка: Telegram ID не найден. Пожалуйста, откройте приложение через Telegram бот.')
        return
    }
    
    // Формируем URL для получения конфигурации с сервера
    const configUrl = `https://bot.adronvpn.ru/key/main/${userId.value}`
    
    // Определяем платформу для URL
    const platform = currentPlatform.value || 'unknown'
    
    // Используем собственный обработчик для установки профиля
    const currentHost = window.location.origin
    const installUrl = `${currentHost}/vpn-app/openapp?key=${encodeURIComponent(configUrl)}&platform=${platform}`
    
    console.log('Opening install URL:', installUrl)
    console.log('Config URL:', configUrl)
    
    // Открываем ссылку в новой вкладке
    window.open(installUrl, '_blank')
}

// Функция для копирования ссылки на подписку
const copySubscriptionLink = async () => {
    // Проверяем наличие Telegram ID
    if (!userId.value) {
        alert('Ошибка: Telegram ID не найден. Пожалуйста, откройте приложение через Telegram бот.')
        return
    }
    
    // Формируем URL для получения конфигурации
    const subscriptionUrl = `https://bot.adronvpn.ru/key/main/${userId.value}`
    
    try {
        await navigator.clipboard.writeText(subscriptionUrl)
        alert('Ссылка на подписку скопирована! Откройте V2Raytun и вставьте её вручную.')
    } catch (err) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea')
        textArea.value = subscriptionUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Ссылка на подписку скопирована! Откройте V2Raytun и вставьте её вручную.')
    }
}

onMounted(() => {
    detectPlatform()
    
    // Инициализируем Telegram WebApp
    initTelegram()
    
    // Показываем кнопку "Назад"
    showBackButton(() => {
        window.history.back()
    })
    
    // Логируем Telegram ID для отладки
    if (userId.value) {
        console.log('User Telegram ID:', userId.value)
    }
})
</script>

<style scoped lang="scss">
.configurations {
	&__title {
		font-size: 24px;
		line-height: 150%;
		margin-bottom: 5px;
		color: #fff;
	}

	&__subtitle {
		font-size: 14px;
		line-height: 150%;
		margin-bottom: 24px;
		color: #D0CBC3;
	}

	&__box {
		background-color: #3F3F3F;
		border-radius: 6px;
		padding: 24px 16px;
		margin-bottom: 24px;
	}

	&__box-description {
		font-size: 14px;
		line-height: 150%;
		margin-bottom: 5px;
		color: #fff;
	}

	&__box-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 48px;
		border-radius: 6px;
		background-color: #E94245;
		border: none;
		transition: 0.3s;
		font-size: 16px;
		line-height: 150%;
		color: #fff;
		margin-bottom: 15px;
		cursor: pointer;

		&:hover {
			background-color: rgba(233, 66, 69, 0.8);
			color: rgba(255, 255, 255, 0.8);
		}
	}
}
</style>
