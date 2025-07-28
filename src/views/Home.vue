<template>
    <div class="home container">
        <div class="home__top-box">
            <p class="home__top-box-subtitle">Необходимо продлить подписку</p>
            <h3 class="home__top-box-title">Подписка истекла</h3>
            <img class="home__top-box-logo logo" id="logo" src="/img/ChatGPT Image 26 июл. 2025 г., 13_05_19.png" alt="">
        </div>

        <div class="home__links">
            <router-link class="router-link" to="/vpn-app/configurations">
                <AtomSVG />
                <span>Установка и настройка VPN</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/about">
                <InstructionSVG />
                <span>Видеоинструкция по установке</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <TarifesSVG />
                <span>Продлить полписку (тарифы)</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/servers">
                <EartSVG />
                <span>Сменить страну (сервера)</span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/help">
                <VoprosSVG />
                <span>Ответы на вопросы</span>
                <CircleArrowSVG />
            </router-link>
        </div>
    </div>
</template>

<script setup>
import VoprosSVG from "../components/icons/VoprosSVG.vue";
import AtomSVG from "../components/icons/AtomSVG.vue";
import InstructionSVG from "../components/icons/InstructionSVG.vue";
import TarifesSVG from "../components/icons/TarifesSVG.vue";
import EartSVG from "../components/icons/EartSVG.vue";
import CircleArrowSVG from "../components/icons/CircleArrowSVG.vue";
import { onMounted } from "vue";

onMounted(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
        tg.BackButton.hide();
    }

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

        .home__top-box-logo {
            max-height: 300px;
            object-fit: cover;
            max-width: 310px;
            margin-inline: auto;
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
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 64px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #fff;
    text-decoration: none;
    padding-inline: 10px;
    overflow: hidden;
    transition: 0.3s;

    &:hover {
        border: 1px solid #DBD6CE;
        background-color: rgba(255, 255, 255, 0.3);
    }

    span {
        margin: 0 auto 0 10px;
    }

    &:first-of-type {
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: linear-gradient(120deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.4) 50%,
                    rgba(255, 255, 255, 0) 100%);
            transform: skewX(-20deg);
            animation: shine 3.2s infinite;
        }
    }
}

@keyframes shine {
    0% {
        left: -75%;
    }

    100% {
        left: 125%;
    }
}
</style>
