<template>
    <div class="home container">
        <ParticleImage :userSubscription="userSubscription" :isSubscriptionExpired="isSubscriptionExpired" />
        <HomeLinks :isSubscriptionExpired="isSubscriptionExpired" />
    </div>
</template>

<script setup>
import ParticleImage from "../components/ParticleImage.vue";
import HomeLinks from "../components/HomeLinks.vue";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useTelegram } from "../composables/useTelegram";
import { useUsersStore } from "../stores";
import { useDate } from "../composables/useDate";

const router = useRouter();
const { hideBackButton, initTelegram, enableSettingsButton } = useTelegram();
const usersStore = useUsersStore();
const { formatSubscriptionDate } = useDate();

const userSubscription = computed(() => {
    const subscription = usersStore.user?.subscription;
    return subscription ? formatSubscriptionDate(subscription) : '';
});

// Computed свойство для определения, истекла ли подписка
const isSubscriptionExpired = computed(() => {
    const subscription = usersStore.user?.subscription;
    if (!subscription) {
        return true; // Если подписки нет, считаем что она истекла
    }
    
    try {
        const subscriptionDate = new Date(subscription);
        const now = new Date();
        return subscriptionDate <= now;
    } catch (error) {
        console.error('Ошибка при парсинге даты подписки:', error);
        return true; // При ошибке считаем что подписка истекла
    }
});

onMounted(async () => {
    initTelegram();
    hideBackButton();
    enableSettingsButton(() => {
        router.push('/settings');
    });
});
</script>

<style scoped lang="scss">
.home {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-image: url('/img/maps.png');
}
</style>
