<template>
    <div class="home container">

        <div class="home__top-box">
            <!--<img class="home__top-box-gradient" src="/img/background-gr.png" alt="">-->
            <img class="home__top-box-logo logo" id="logo" src="/img/ChatGPT Image 25 июл. 2025 г., 21_04_28.png" alt="">
            <p class="home__top-box-subtitle">Необходимо продлить подписку</p>
            <h3 class="home__top-box-title">Подписка истекла</h3>
        </div>

        <div class="home__links">
            <router-link class="router-link" to="/">
                <VoprosSVG />
                <span>Установка и настройка VPN</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/">
                <VoprosSVG />
                <span>Установка и настройка VPN</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/">
                <VoprosSVG />
                <span>Установка и настройка VPN</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/">
                <VoprosSVG />
                <span>Установка и настройка VPN</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/">
                <VoprosSVG />
                <span>Установка и настройка VPN</span>
                <CircleArrowSVG />
            </router-link>
        </div>
    </div>
</template>

<script setup>
import VoprosSVG from "../components/icons/VoprosSVG.vue";
import CircleArrowSVG from "../components/icons/CircleArrowSVG.vue";
import { onMounted } from "vue";

onMounted(() => {
    nextParticle = new NextParticle({
        image: document.all.logo,
        addTimestamp: true,
        width: window.innerWidth,
        height: 300,
        particleGap: 3,
        mouseForce: 20
    });
});
</script>

<style scoped lang="scss">
.home {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    background-image: url('/img/maps.png');

    .home__top-box {
        display: flex;
        flex-direction: column-reverse;
        position: relative;
        overflow: hidden;
        margin-inline: -14px;
        margin-bottom: 25px;

        .home__top-box-gradient {
            position: relative;
            top: -260px;
            left: 50%;
            transform: translate(-50%, 0);
            opacity: .6;
        }

        .home__top-box-title {
            font-size: 32px;
            color: #fff;
            line-height: 150%;
            padding-inline: 14px;
            text-align: center;
        }

        .home__top-box-subtitle {
            font-size: 14px;
            color: #D0CBC3;
            line-height: 150%;
            padding-inline: 14px;
            text-align: center;
        }
    }

    .home__links {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
.router-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 64px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #fff;
    text-decoration: none;
    padding-inline: 10px;
    transition: .3s;

    &:hover {
        border: 1px solid #DBD6CE;
        background-color: rgba(255, 255, 255, 0.3);
    }

    span {
        margin: 0 auto 0 10px;
    }
}
</style>
