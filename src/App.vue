<template>
	<!--<div v-if="isPreloader" class="preloader"></div>-->
	<router-view></router-view>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const isPreloader = ref(true);

onMounted(() => {
	setTimeout(() => {
		isPreloader.value = false;
	}, 2000)
});
</script>

<style scoped>
.preloader {
	position: fixed;
	inset: 0;
	backdrop-filter: blur(20px);
}
</style>
