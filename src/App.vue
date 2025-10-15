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
