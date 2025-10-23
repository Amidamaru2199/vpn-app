<template>
    <div class="particle">
        <div class="particle__text-content">
            <!-- <p class="particle__title">Подписка активна</p> -->
            <h3 class="particle__subtitle">{{ subscriptionStatus }}</h3>
        </div>
        <img class="particle__logo logo" id="logo" src="/img/ChatGPT Image 25 июл. 2025 г., 21_04_28.png" alt="">
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
    userSubscription: {
        type: String,
        default: ''
    },
    isSubscriptionExpired: {
        type: Boolean,
        default: false
    }
})

// Computed свойство для определения статуса подписки
const subscriptionStatus = computed(() => {
    if (!props.userSubscription) {
        return 'Подписка не найдена'
    }
    
    if (props.isSubscriptionExpired) {
        return 'Подписка истекла. Продлите её в разделе «Тарифы»'
    } else {
        return `Подписка активна до ${props.userSubscription}`
    }
})

// Computed свойство для определения, истекла ли подписка (используем переданный пропс)
const isSubscriptionExpired = computed(() => props.isSubscriptionExpired)

let nextParticle = null;

onMounted(() => {
    // Проверяем доступность библиотеки NextParticle
    if (typeof NextParticle !== 'undefined' && document.getElementById('logo')) {
        try {
            nextParticle = new NextParticle({
                image: document.getElementById('logo'),
                addTimestamp: true,
                width: window.innerWidth,
                height: 300,
                particleGap: 1,
                mouseForce: 20
            });
        } catch (error) {
            console.error('NextParticle initialization error:', error);
        }
    }
});
</script>

<style scoped lang="scss">
.particle {
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    overflow: hidden;
    margin: -22px -14px 25px;

    &__text-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: -25px;
    }

    &__logo {
        max-height: 300px;
        object-fit: cover;
        max-width: 310px;
        margin-inline: auto;
    }

    &__title {
        font-size: 32px;
        color: $primary-color;
        line-height: 1;
        padding-inline: 14px;
        text-align: center;
    }

    &__subtitle {
        font-size: 14px;
        color: $secondary-color;
        line-height: 150%;
        padding-inline: 14px;
        text-align: center;
    }
}
</style>