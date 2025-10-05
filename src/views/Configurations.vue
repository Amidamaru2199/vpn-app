<template>
	<div class="configurations container">
		<h3 class="configurations__title">Быстрая настройка</h3>
		<p class="configurations__subtitle">Процесс первичной настройки</p>
		<div class="configurations__box">
			<p class="configurations__box-description">1. Скачайте и откройте v2Raytun, а затем вернитесь к текущему экрану</p>
			<button class="configurations__box-button" @click="openAppStore">Скачатъ</button>
			<p class="configurations__box-description">2. Установите профиль</p>
			<button class="configurations__box-button">Установить</button>
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
}

// Функция для открытия магазина приложений
const openAppStore = () => {
    if (isIOS.value) {
        // App Store для iOS
        window.open('https://apps.apple.com/app/v2raytun/id6446773340', '_blank')
    } else if (isAndroid.value) {
        // Google Play для Android
        window.open('https://play.google.com/store/apps/details?id=com.v2raytun.android', '_blank')
    } 
	// else {
    //     // Fallback - показываем оба варианта
    //     const choice = confirm('Выберите магазин приложений:\nOK - App Store (iOS)\nCancel - Google Play (Android)')
    //     if (choice) {
    //         window.open('https://apps.apple.com/app/v2raytun/id6446773340', '_blank')
    //     } else {
    //         window.open('https://play.google.com/store/apps/details?id=com.v2raytun.app', '_blank')
    //     }
    // }
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
	.configurations__title {
		font-size: 24px;
		line-height: 150%;
		margin-bottom: 5px;
		color: #fff;
	}

	.configurations__subtitle {
		font-size: 14px;
		line-height: 150%;
		margin-bottom: 24px;
		color: #D0CBC3;
	}

	.configurations__box {
		background-color: #3F3F3F;
		border-radius: 6px;
		padding: 24px 16px;
		margin-bottom: 24px;
	}

	.configurations__box-description {
		font-size: 14px;
		line-height: 150%;
		margin-bottom: 5px;
		color: #fff;
	}

	.configurations__box-button {
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

	.configurations__box-recomendations {
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
