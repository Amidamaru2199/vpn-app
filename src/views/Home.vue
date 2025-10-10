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
import { useRouter } from "vue-router";
import { useTelegram } from "../composables/useTelegram";

const router = useRouter();
const { hideBackButton, initTelegram, userId, enableSettingsButton } = useTelegram();

onMounted(() => {
    // Инициализируем Telegram WebApp
    initTelegram();
    
    // Скрываем кнопку "Назад" на главной странице
    hideBackButton();
    
    // Показываем кнопку Settings в меню (три точки)
    enableSettingsButton(() => {
        router.push('/settings');
    });
    
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
