<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Помощь</h3>
        <p class="tarifes__subtitle">Тут ответы на все вопросы</p>
        <div class="tarifes__links">
            <router-link class="router-link" to="/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/tarifes">
                <span class="router-link__text">
                    Инструкция по подключению iOS через V2RayTun
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/tarifes">
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
        color: $primary-color;
        margin: 20px 0 10px;
    }

    .servers__link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 42px;
        width: 100%;
        color: $primary-color;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 6px;
        text-decoration: none;
        padding: 10px;
        transition: .3s;

        &:hover {
            border: 1px solid $router-link-active-border-color;
            background-color: $router-link-background-hover-color;
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
        color: $primary-color;
    }

    .tarifes__subtitle {
        font-size: 14px;
        line-height: 150%;
        margin-bottom: 24px;
        color: $secondary-color;
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
        color: $secondary-color;
    }

    .router-link__price {
        font-size: 12px;
        line-height: 150%;
        color: $secondary-color;
    }

    .tarifes__text {
        font-size: 12px;
        line-height: 150%;
        color: $secondary-color;
        border: 1px solid $secondary-color;
        border-radius: 4px;
        margin-top: auto;
        padding: 5px;
        background: $router-link-background-color;

        p:first-of-type {
            margin-bottom: 5px;
        }
    }
}
</style>
