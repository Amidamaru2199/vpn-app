<template>
	<router-view></router-view>
	<div class="toast-container">
		<TransitionGroup name="toast-list">
			<div 
				v-for="toast in toasts" 
				:key="toast.id"
				class="toast" 
				:class="`toast--${toast.type}`"
			>
				<div class="toast__content">
					<span class="toast__icon">{{ getIcon(toast.type) }}</span>
					<span class="toast__message">{{ toast.message }}</span>
				</div>
				<button class="toast__close" @click="removeToast(toast.id)">×</button>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTelegram } from './composables/useTelegram'
import { useUsersStore } from './stores/index.js'
import { useToast } from './composables/useToast'

const usersStore = useUsersStore()
const { error: showError } = useToast()
const { userId, initTelegram, showBackButton } = useTelegram()
const { toasts, remove: removeToast } = useToast()

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

<style scoped>
.preloader {
	position: fixed;
	inset: 0;
	backdrop-filter: blur(20px);
}

.toast-container {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-width: 400px;
}

.toast {
	min-width: 280px;
	padding: 16px;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
	color: #fff;
}

.toast__close {
	background: none;
	border: none;
	color: #fff;
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

.toast__close:hover {
	opacity: 1;
}

.toast--success {
	background: linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%);
}

.toast--error {
	background: linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(211, 47, 47, 0.95) 100%);
}

.toast--warning {
	background: linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(245, 124, 0, 0.95) 100%);
}

.toast--info {
	background: linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(25, 118, 210, 0.95) 100%);
}

.toast-list-enter-active,
.toast-list-leave-active {
	transition: all 0.3s ease;
}

.toast-list-enter-from {
	opacity: 0;
	transform: translateX(100%);
}

.toast-list-leave-to {
	opacity: 0;
	transform: translateY(-10px);
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
