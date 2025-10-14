<template>
	<div class="configurations container">
		<h3 class="configurations__title">Настройка VPN на устройстве</h3>
		<p class="configurations__subtitle">Всего пару шагов и можно пользоваться</p>
		<div class="configurations__box">
			<p class="configurations__box-description">1. Скачайте и откройте {{ isWindows ? 'Hiddify' : 'V2Raytun' }}, а затем вернитесь к текущему
				экрану</p>
			<button class="configurations__box-button" @click="openStore">Скачать</button>
			<p class="configurations__box-description">2. Добавьте подписку в {{ isWindows ? 'Hiddify' : 'V2Raytun' }}</p>
			<button class="configurations__box-button" @click="installProfile">Добавить</button>
			<p class="configurations__box-description">3. И все! Нажмите на кнопку подключения в {{ isWindows ? 'Hiddify' : 'V2Raytun' }} и забудьте об
				ограничениях</p>
		</div>
		<div class="configurations__box">
			<h3 class="configurations__title">Добавить подписку вручную</h3>
			<button class="configurations__box-button" @click="copySubscriptionLink">Скопировать ссылку на
				подписку</button>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'
import { usePlatform } from '../composables/usePlatform'
import { useClipboard } from '../composables/useClipboard'
import { useToast } from '../composables/useToast'

const router = useRouter()

const { userId, initTelegram, showBackButton } = useTelegram()
const { currentPlatform, detectPlatform, isWindows, openAppStore: openStore } = usePlatform()
const { copyToClipboard } = useClipboard()
const { error: showError } = useToast()

const installProfile = () => {
	if (!userId.value) {
		showError('Ошибка: Telegram ID не найден. Пожалуйста, откройте приложение через Telegram бот.')
		return
	}

	const configUrl = `https://bot.adronvpn.ru/key/main/${userId.value}`
	const platform = currentPlatform.value || 'unknown'
	
	// Формируем полный URL для страницы OpenApp
	const openAppUrl = `${window.location.origin}/vpn-app/openapp?key=${encodeURIComponent(configUrl)}&platform=${platform}`
	
	const tg = window.Telegram?.WebApp
	if (tg && tg.openLink) {
		tg.openLink(openAppUrl)
	} else {
		router.push({
			path: '/openapp',
			query: {
				key: configUrl,
				platform: platform
			}
		})
	}
}

const copySubscriptionLink = () => {
	if (!userId.value) {
		showError('Ошибка: Telegram ID не найден. Пожалуйста, откройте приложение через Telegram бот.')
		return
	}

	const subscriptionUrl = `https://bot.adronvpn.ru/key/main/${userId.value}`
	copyToClipboard(subscriptionUrl, `Ссылка на подписку скопирована! Откройте ${isWindows.value ? 'Hiddify' : 'V2Raytun'} и вставьте её вручную.`)
}

onMounted(() => {
	detectPlatform()
	initTelegram()
	showBackButton(() => {
		window.history.back()
	})
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
