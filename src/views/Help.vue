<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Помощь</h3>
        <p class="tarifes__subtitle">Тут ответы на все вопросы</p>
        <div class="tarifes__links">
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
        </div>
        <p class="help__questions">Не нащли ответ на свой вопрос?</p>
        <a class="servers__link" href="#">
            <TelegramSVG />
            Тех поддержка
        </a>
    </div>
</template>

<script setup>
import TelegramSVG from '../components/icons/TelegramSVG.vue';
import CircleArrowSVG from "../components/icons/CircleArrowSVG.vue";
import { onMounted } from 'vue';

onMounted(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.BackButton.show();  // показать кнопку "назад"
        tg.BackButton.onClick(() => {
            window.history.back(); // можно заменить на router.back() если используешь Vue Router
        });
    }
});
</script>

<style scoped lang="scss">
.tarifes {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .help__questions {
        color: #fff;
        margin: 20px 0 10px;
    }

    .servers__link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 42px;
        width: 100%;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 6px;
        text-decoration: none;
        padding: 10px;
        transition: .3s;

        &:hover {
            border: 1px solid #DBD6CE;
            background-color: rgba(255, 255, 255, 0.3);
        }

        svg {
            width: 25px;
            height: 25px;
        }
    }

    .tarifes__title {
        font-size: 24px;
        line-height: 150%;
        margin-bottom: 5px;
        color: #fff;
    }

    .tarifes__subtitle {
        font-size: 14px;
        line-height: 150%;
        margin-bottom: 24px;
        color: #D0CBC3;
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

    .tarifes__links {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .router-link__text {
        display: flex;
        flex-direction: column;
    }

    .router-link__duration {
        font-size: 14px;
        line-height: 150%;
        color: #D0CBC3;
    }

    .router-link__price {
        font-size: 12px;
        line-height: 150%;
        color: #D0CBC3;
    }

    .tarifes__text {
        font-size: 12px;
        line-height: 150%;
        color: #D0CBC3;
        border: 1px solid #D0CBC3;
        border-radius: 4px;
        margin-top: auto;
        padding: 5px;
        background: rgba(255, 255, 255, 0.1);

        p:first-of-type {
            margin-bottom: 5px;
        }
    }
}
</style>
