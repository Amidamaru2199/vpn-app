<template>
	<div class="openapp container">
		<img class="openapp__logo" src="/img/atom.png" alt="vpn">
		<h2 class="openapp__title">
			Если приложение {{ isWindows ? 'Hiddify' : 'V2Raytun' }} не открылось
		</h2>
		<p class="openapp__subtitle">Убедитесь, что оно установлено, или скопируйте и вставьте ключ вручную.</p>

		<button @click="openApp" class="openapp__button openapp__button--green">
			Попробовать снова
		</button>

		<button @click="copyConfig" class="openapp__button openapp__button--blue">
			Скопировать ключ
		</button>

		<button @click="openStore" class="openapp__button">
			Установить {{ isWindows ? 'Hiddify' : 'V2Raytun' }}
		</button>

		<a href="https://t.me/adronVpnBot" target="_blank" class="openapp__link">
			Вернуться в телеграм
		</a>

		<div v-if="error" class="openapp__error">
			{{ error }}
		</div>

	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'
import { usePlatform } from '../composables/usePlatform'
import { useClipboard } from '../composables/useClipboard'

const route = useRoute()
const config = ref('')
const appURL = ref('')
const error = ref('')
const isLoading = ref(false)

const { initTelegram } = useTelegram()
const { currentPlatform, isApplePlatform, isAndroid, isWindows, openAppStore: openStore } = usePlatform()
const { copyToClipboard } = useClipboard()

onMounted(async () => {
	initTelegram()

	const key = route.query.key
	const platform = route.query.platform

	if (!key || !platform) {
		error.value = 'Отсутствуют обязательные параметры: ключ и платформа.'
		return
	}

	try {
		isLoading.value = true
		
		const platformLower = platform.toLowerCase()
		if (!['ios', 'android', 'macos', 'windows'].includes(platformLower)) {
			error.value = `Неподдерживаемая платформа: ${platform}`
			isLoading.value = false
			return
		}
		currentPlatform.value = platformLower

		config.value = key

		if (isApplePlatform.value) {
			appURL.value = `v2raytun://import/${key}`
		} else if (isAndroid.value) {
			appURL.value = `intent://import/${key}#Intent;scheme=v2raytun;package=com.v2raytun.android;end`
		} else if (isWindows.value) {
			appURL.value = `hiddify://import/${key}`
		}

		isLoading.value = false

		setTimeout(() => {
			if (appURL.value && !error.value) {
				window.location.href = appURL.value
			}
		}, 500)

	} catch (err) {
		error.value = 'Error processing configuration: ' + err.message
		isLoading.value = false
		console.error('Error:', err)
	}
})

const openApp = () => {
	if (!appURL.value || error.value) return
	window.location.href = appURL.value
}

const copyConfig = () => {
	copyToClipboard(config.value, 'Ссылка скопирована. Откройте ее в приложении вручную.')
}
</script>

<style scoped lang="scss">
.openapp {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	text-align: center;

	&__logo {
		margin-bottom: -30px;
		max-width: 200px;
		object-fit: contain;
	}

	&__title {
		font-size: 28px;
		font-weight: 600;
		color: $primary-color;
		margin-bottom: 10px;
	}

	&__subtitle {
		font-size: 16px;
		margin-bottom: 30px;
		color: $primary-color;
		line-height: 1.5;
	}

	&__button {
		min-height: 52px;
		margin-bottom: 10px;
		border: 1px solid $primary-color;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: $primary-color;
		cursor: pointer;
		transition: all 0.3s ease;
		min-width: 210px;
		background: $open-app-don-color;
		box-shadow: 0 4px 15px $open-app-shadow-color;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			box-shadow: 0 0px 30px $open-app-shadow-hover-color;
		}

		&--green {
			background: $open-app-copy-color;
			box-shadow: 0 4px 15px $open-app-shadow-copy-color;

			&:hover {
				box-shadow: 0 0px 30px $open-app-shadow-copy-hover-color;
			}
		}

		&--blue {
			background: $open-app-re-color;
			box-shadow: 0 4px 15px $open-app-shadow-re-color;

			&:hover {
				box-shadow: 0 0px 30px $open-app-shadow-re-hover-color;
			}
		}
	}

	&__link {
		margin-top: 20px;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: $primary-color;

		&:hover {
			opacity: 0.8;
		}
	}

	&__error {
		margin-top: 20px;
		padding: 15px;
		background: linear-gradient(#ff416c 0%);
		border-radius: 8px;
		color: $primary-color;
	}
}
</style>
