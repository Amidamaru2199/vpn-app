<template>
    <div class="particle">
        <p class="particle-subtitle">Необходимо продлить подписку</p>
        <h3 class="particle-title">Подписка истекла</h3>
        <img class="particle-logo logo" id="logo" src="/img/ChatGPT Image 26 июл. 2025 г., 13_05_19.png" alt="">
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
onMounted(() => {
    nextParticle = new NextParticle({
        image: document.all.logo,
        addTimestamp: true,
        width: window.innerWidth,
        height: 300,
        particleGap: 1,
        mouseForce: 20
    });
});
</script>

<style scoped lang="scss">
.particle {
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    overflow: hidden;
    margin-inline: -14px;
    margin-bottom: 25px;

    &-logo {
        max-height: 300px;
        object-fit: cover;
        max-width: 310px;
        margin-inline: auto;
    }

    &-title {
        font-size: 32px;
        color: #fff;
        line-height: 150%;
        padding-inline: 14px;
        text-align: center;
    }

    &-subtitle {
        font-size: 14px;
        color: #D0CBC3;
        line-height: 150%;
        padding-inline: 14px;
        text-align: center;
    }
}
</style>