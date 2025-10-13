<template>
	<router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTelegram } from './composables/useTelegram'
import { useUsersStore } from './stores/index.js'
const usersStore = useUsersStore()
const { userId, initTelegram, showBackButton } = useTelegram()

onMounted(async () => {
	initTelegram()

	showBackButton(() => {
		window.history.back()
	})

	if (!userId.value) {
		await usersStore.fetchUser(1024324171);
		await usersStore.fetchServers(1024324171)
		await usersStore.fetchAllTariffs()
	} else {
		alert('Ошибка: Telegram ID не найден')
	}
})
</script>

<style scoped>
.preloader {
	position: fixed;
	inset: 0;
	backdrop-filter: blur(20px);
}
</style>
