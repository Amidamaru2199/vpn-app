<template>
    <div class="home container">
        <ParticleImage />
        <HomeLinks />
    </div>
</template>

<script setup>
import ParticleImage from "../components/ParticleImage.vue";
import HomeLinks from "../components/HomeLinks.vue";
import { onMounted } from "vue";
import { useTelegram } from "../composables/useTelegram";

const { hideBackButton, initTelegram, userId } = useTelegram();

onMounted(() => {
    // Инициализируем Telegram WebApp
    initTelegram();
    
    // Скрываем кнопку "Назад" на главной странице
    hideBackButton();
    
    // Получаем ID пользователя для дальнейшего использования
    if (userId.value) {
        console.log('User ID:', userId.value);
    }
});
</script>

<style scoped lang="scss">
.home {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    background-image: url('/img/maps.png');
}
</style>
