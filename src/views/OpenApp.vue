<template>
	<div class="openapp container">
		<img class="openapp__logo" src="/img/atom.png" alt="v2raytun">
		<h2 class="openapp__title">Если приложение v2Raytun не открылось</h2>
		<p class="openapp__subtitle">Убедитесь, что оно установлено, или скопируйте и вставьте ключ вручную.</p>

		<button @click="openApp" class="openapp__button">
			Попробовать снова
		</button>

		<button @click="copyConfig" class="openapp__button">
			Скопировать ключ
		</button>

		<button @click="openAppStore" class="openapp__button">
			Установить v2Raytun
		</button>

		<a href="http://gavnetzobot" target="_blank" class="openapp__link">
			Вернуться в телеграм
		</a>

		<div v-if="error" class="openapp__error">
			{{ error }}
		</div>

	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const config = ref('')
const appURL = ref('')
const error = ref('')
const currentPlatform = ref('')

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

onMounted(() => {
	detectPlatform()
	const key = route.query.key
	const platform = route.query.platform

	if (!key || !platform) {
		error.value = 'Missing required parameters: key and platform'
		return
	}

	try {
		config.value = decodeURIComponent(key)
		const platformFromQuery = platform.toLowerCase()

		if (['ios', 'android', 'macos'].includes(platformFromQuery)) {
			currentPlatform.value = platformFromQuery
		}

		if (isApplePlatform.value) {
			appURL.value = `v2raytun://import/${encodeURIComponent(config.value)}`
		} else if (isAndroid.value) {
			appURL.value = `intent://import/${encodeURIComponent(config.value)}#Intent;scheme=v2raytun;package=com.v2raytun.android;end`
		} else {
			error.value = `Unsupported platform: ${platform}`
			return
		}

		setTimeout(() => {
			if (appURL.value && !error.value) {
				window.location.href = appURL.value
			}
		}, 100)

	} catch (err) {
		error.value = 'Error processing configuration: ' + err.message
	}
})

const openApp = () => {
	if (!appURL.value || error.value) return

	try {
		window.location.href = appURL.value

	} catch (err) {
		console.error('Error opening app:', err)
	}
}

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

const copyConfig = async () => {
	try {
		await navigator.clipboard.writeText(config.value)
		alert('Ссылка скопирована. Откройте ее в приложении вручную.')
	} catch (err) {
		const textArea = document.createElement('textarea')
		textArea.value = config.value
		document.body.appendChild(textArea)
		textArea.select()
		document.execCommand('copy')
		document.body.removeChild(textArea)
		alert('Ссылка скопирована. Откройте ее в приложении вручную.')
	}
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
		color: #fff;
		margin-bottom: 10px;
	}

	&__subtitle {
		font-size: 16px;
		margin-bottom: 30px;
		color: #fff;
		line-height: 1.5;
	}

	&__button {
		min-height: 52px;
		margin-bottom: 10px;
		border: 1px solid #fff;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
		min-width: 210px;
		background: linear-gradient(135deg, #ff416c 0%, #6a82fb 100%);
		box-shadow: 0 4px 15px rgba(106, 130, 251, 0.3);

		&:hover {
			box-shadow: 0 0px 30px rgba(106, 130, 251, 0.5);
		}
	}

	&__link {
		margin-top: 20px;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: white;

		&:hover {
			opacity: 0.8;
		}
	}

	&__error {
		margin-top: 20px;
		padding: 15px;
		background: linear-gradient(#ff416c 0%);
		border-radius: 8px;
		color: #fff;
	}
}
</style>
