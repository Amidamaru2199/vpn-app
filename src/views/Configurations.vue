<template>
	<div class="configurations container">
		<h3 class="configurations__title">Быстрая настройка</h3>
		<p class="configurations__subtitle">Процесс первичной настройки</p>
		<div class="configurations__box">
			<p class="configurations__box-description">1. Скачайте и откройте v2Raytun, а затем вернитесь к текущему экрану</p>
			<button class="configurations__box-button" @click="openAppStore">Скачать</button>
			<p class="configurations__box-description">2. Установите профиль</p>
			<button class="configurations__box-button" @click="installProfile">Установить</button>
			<p class="configurations__box-description">3. Готово! Подключитесь к VPN и пользуйтесь интернетом без ограничений</p>
			<p class="configurations__box-recomendations">Дополнительно рекомендуем добавить роутинг, что бы при подключении к российским сайтам не использовался VPN. Telegram и WhatsApp будут работать быстрее.</p>
		</div>
		<div class="configurations__box">
			<h3 class="configurations__title">Установить ключ в ручную</h3>
			<button class="configurations__box-button">Получить ключ</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Определение платформы устройства
const isIOS = ref(false)
const isAndroid = ref(false)
const isMacOS = ref(false)

// Функция для определения платформы
const detectPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    
    // Проверяем iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        isIOS.value = true
    }
    // Проверяем Android
    else if (/android/i.test(userAgent)) {
        isAndroid.value = true
    }
    // Проверяем macOS
    else if (/Macintosh|Mac OS X/.test(userAgent)) {
        isMacOS.value = true
    }
}

// Функция для открытия магазина приложений
const openAppStore = () => {
    if (isIOS.value || isMacOS.value) {
        // App Store для iOS
        window.open('https://apps.apple.com/ru/app/v2raytun/id6476628951', '_blank')
    } else if (isAndroid.value) {
        // Google Play для Android
        window.open('https://play.google.com/store/apps/details?id=com.v2raytun.android', '_blank')
    } else {
        // Fallback - показываем оба варианта для других платформ
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
    // Конфигурация vless (замените на вашу реальную конфигурацию)
    const vlessConfig = "vless://1f0e62c3-28b0-4335-a16f-001ce02191f5@46.226.166.23:443?type=tcp&security=reality&pbk=-rHxsEO8D1KjRPctrcSG0IaJbTfU3wqsOgi4i3q6TSo&fp=chrome&sni=www.github.com&sid=b8f6&spx=%2F&flow=xtls-rprx-vision#AdronVPN:FR"
    
    // Определяем платформу для URL
    let platform = 'unknown'
    if (isIOS.value) {
        platform = 'ios'
    } else if (isAndroid.value) {
        platform = 'android'
    } else if (isMacOS.value) {
        platform = 'macos'
    }
    
    // Используем собственный обработчик для установки профиля
    const currentHost = window.location.origin
    const installUrl = `${currentHost}/vpn-app/openapp?key=${encodeURIComponent(vlessConfig)}&platform=${platform}`
    
    // Открываем ссылку в новой вкладке
    window.open(installUrl, '_blank')
}

onMounted(() => {
    detectPlatform()
    
    // Telegram WebApp инициализация
    const tg = window.Telegram?.WebApp
    if (tg) {
        tg.BackButton.show()
        tg.BackButton.onClick(() => {
            window.history.back()
        })
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

	&__box-recomendations {
		font-size: 12px;
		line-height: 150%;
		color: #D0CBC3;
		border: 1px solid #D0CBC3;
		border-radius: 4px;
		margin-top: 10px;
		padding: 5px;
	}
}
</style>
