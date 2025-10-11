<template>
	<router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsersStore } from './stores/index.js'
const usersStore = useUsersStore()

onMounted(async () => {
	await usersStore.fetchUser(1024324171);
	console.log(usersStore.user);
});
</script>

<style scoped>
.preloader {
	position: fixed;
	inset: 0;
	backdrop-filter: blur(20px);
}
</style>
