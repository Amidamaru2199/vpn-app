<template>
	<router-view></router-view>
	<Preloader :isInitializing="isInitializing" />
	<div class="toast-container">
		<TransitionGroup name="toast-list">
			<div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`">
				<div class="toast__content">
					<span v-if="toast.type !== 'modal'" class="toast__icon">{{ getIcon(toast.type) }}</span>
					<span class="toast__message">{{ toast.message }}</span>
				</div>
				<button v-if="toast.type !== 'modal'" class="toast__close" @click="removeToast(toast.id)">×</button>
				<button v-else class="toast__sucsess" @click="removeToast(toast.id)">ОК</button>
			</div>
		</TransitionGroup>
	</div>

	<!-- Overlay для модальных тостов -->
	<Transition name="overlay">
		<div v-if="hasModalToast" class="toast-overlay" @click="closeModalToast"></div>
	</Transition>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useTelegram } from './composables/useTelegram'
import { useUsersStore } from './stores/index.ts'
import { useToast } from './composables/useToast'
import { useRoute } from 'vue-router'
import Preloader from './components/ui/Preloader.vue'

const usersStore = useUsersStore()
const { error: showError, toasts, remove: removeToast } = useToast()
const { initTelegram, showBackButton, setUserId } = useTelegram()
const route = useRoute()
const isInitializing = ref(true)

// Computed свойство для проверки наличия модальных тостов
const hasModalToast = computed(() => {
	return toasts.value.some(toast => toast.type === 'modal')
})

// Метод для закрытия модального тоста
const closeModalToast = () => {
	const modalToast = toasts.value.find(toast => toast.type === 'modal')
	if (modalToast) {
		removeToast(modalToast.id)
	}
}

const getIcon = (type) => {
	const icons = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	}
	return icons[type] || icons.info
}

onMounted(async () => {
	initTelegram()

	showBackButton(() => {
		window.history.back()
	})

	// Даём время Telegram WebApp инициализироваться
	await new Promise(resolve => setTimeout(resolve, 500))

	const tg = window.Telegram?.WebApp
	const user = tg?.initDataUnsafe?.user

	// Попытка получить данные из разных источников
	// let userId = user?.id
	let userId = 804746752

	// Способ 1: Парсинг через URLSearchParams (альтернативный способ из Telegram)
	if (!userId && tg?.initData) {
		try {
			const params = new URLSearchParams(tg.initData)
			const userRaw = params.get("user")
			if (userRaw) {
				const parsedUser = JSON.parse(decodeURIComponent(userRaw))
				userId = parsedUser?.id
			}
		} catch (e) {
			console.error('Ошибка парсинга user данных:', e)
		}
	}

	// Способ 2: ID из start_param (для прямых ссылок Telegram)
	if (!userId && tg?.initDataUnsafe?.start_param) {
		const startParam = tg.initDataUnsafe.start_param
		// Формат: uid_123456789 или просто 123456789
		const match = startParam.match(/^(?:uid_)?(\d+)$/)
		if (match) {
			const parsedId = parseInt(match[1])
			if (!isNaN(parsedId) && parsedId > 0) {
				userId = parsedId
				console.log('✅ Используется Telegram ID из start_param:', userId)
			}
		}
	}

	// Способ 3: ID из URL параметров (для веб-версии)
	if (!userId) {
		const urlParams = new URLSearchParams(window.location.search)
		const userIdFromUrl = urlParams.get('user_id') || urlParams.get('tg_id')
		if (userIdFromUrl) {
			const parsedId = parseInt(userIdFromUrl)
			if (!isNaN(parsedId) && parsedId > 0) {
				userId = parsedId
				console.log('✅ Используется Telegram ID из URL:', userId)
			}
		}
	}

	// Режим разработки - раскомментируйте если нужен тестовый ID
	// if (!userId && import.meta.env.DEV) {
	// 	userId = 804746752 // Тестовый ID для разработки
	// 	console.warn('Используется тестовый Telegram ID для разработки')
	// }

	if (userId) {
		// Сохраняем userId глобально для доступа на всех страницах
		setUserId(userId)
		
		await usersStore.fetchUser(userId)
		await usersStore.fetchAllTariffs()
	} else {
		// Показываем ошибку только если это не страница /openapp
		if (route.path !== '/openapp') {
			console.error('Telegram user data:', { 
				hasTg: !!tg, 
				hasInitData: !!tg?.initData,
				hasUser: !!user,
				initDataUnsafe: tg?.initDataUnsafe 
			})
			showError('Не удалось получить данные пользователя. Попробуйте перезапустить приложение.')
		}
	}

	// Убираем индикатор загрузки инициализации
	isInitializing.value = false
})
</script>

<style lang="scss" scoped>
.toast-container {
	position: fixed;
	top: 22px;
	right: 14px;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-width: calc(100% - 28px);
}

.toast {
	min-width: 280px;
	padding: 16px;
	border-radius: 8px;
	box-shadow: 0 4px 12px $shadow-color;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	backdrop-filter: blur(10px);
	animation: slideIn 0.3s ease;
}

.toast__content {
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
}

.toast__icon {
	font-size: 20px;
	font-weight: bold;
	flex-shrink: 0;
}

.toast__message {
	font-size: 14px;
	line-height: 1.4;
	word-break: break-word;
	color: $primary-color;
}

.toast__close {
	background: none;
	border: none;
	color: $primary-color;
	font-size: 24px;
	line-height: 1;
	cursor: pointer;
	padding: 0;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.7;
	transition: opacity 0.2s;
	flex-shrink: 0;
}

.toast__sucsess {
	background: $background-red-color;
	color: $primary-color;
	font-size: 14px;
	line-height: 1.4;
	word-break: break-word;
	padding: 10px 20px;
	border-radius: 6px;
	cursor: pointer;
	transition: opacity 0.2s;
	border: none;
}

.toast__close:hover {
	opacity: 1;
}

.toast--success {
	background: $success-gradient-color;
}

.toast--error {
	background: $error-gradient-color;
}

.toast--warning {
	background: $warning-gradient-color;
}

.toast--info {
	background: $info-gradient-color;
}

.toast--modal {
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 50%;
	left: 50%;
	padding: 24px 20px;
	transform: translate(-50%, -50%);
	min-width: 320px;
	max-width: 90vw;
	background: $body-background-color;
	border: 1px solid $secondary-color;
	backdrop-filter: blur(20px);
	z-index: 10000;

	.toast__content {
		justify-content: center;
		text-align: center;
	}

	.toast__message {
		font-size: 20px;
		font-weight: 500;
	}

	.toast__close {
		position: absolute;
		top: 12px;
		right: 12px;
		font-size: 24px;
		opacity: 0.8;

		&:hover {
			opacity: 1;
		}
	}
}

.toast-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(5px);
	z-index: 1000;
	cursor: pointer;
	transition: 0.3s ease;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(100%);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}
</style>
