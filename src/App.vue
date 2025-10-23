<template>
	<router-view></router-view>
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
import { onMounted, computed } from 'vue';
import { useTelegram } from './composables/useTelegram'
import { useUsersStore } from './stores/index.js'
import { useToast } from './composables/useToast'

const usersStore = useUsersStore()
const { error: showError } = useToast()
const { userId, initTelegram, showBackButton } = useTelegram()
const { toasts, remove: removeToast } = useToast()

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

	if (userId.value) {
		await usersStore.fetchUser(userId.value);
		await usersStore.fetchServers(userId.value)
		await usersStore.fetchAllTariffs()
	} else {
		showError('Ошибка: Telegram ID не найден')
	}
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
