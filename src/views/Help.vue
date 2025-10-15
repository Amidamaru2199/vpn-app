<template>
    <div class="help container">
        <h3 class="help__title">Помощь</h3>
        <p class="help__subtitle">Тут ответы на все вопросы</p>
        <div class="help__links">
            <RouterLink :to="'https://telegra.ph/Instrukciya-po-podklyucheniyu-iOS-cherez-V2RayTun-06-25'">
                <template #text>
                    <span class="help__router-link-text">
                        Инструкция по подключению iOS через V2RayTun
                    </span>
                </template>
            </RouterLink>
        </div>
        <p class="help__questions">Не нащли ответ на свой вопрос?</p>
        <a class="help__servers-link" href="#">
            <TelegramSVG />
            Тех поддержка
        </a>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import TelegramSVG from '../components/icons/TelegramSVG.vue';
import { onMounted } from 'vue';

onMounted(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            window.history.back();
        });
    }
});
</script>

<style scoped lang="scss">
.help {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__questions {
        color: $primary-color;
        margin: 20px 0 10px;
    }

    &__servers-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 42px;
        width: 100%;
        color: $primary-color;
        border: 1px solid $background-color;
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

    &__title {
        font-size: 24px;
        line-height: 150%;
        margin-bottom: 5px;
        color: $primary-color;
    }

    &__subtitle {
        font-size: 14px;
        line-height: 150%;
        margin-bottom: 24px;
        color: $secondary-color;
    }

    &__links {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__router-link-text {
        display: flex;
        flex-direction: column;
    }
}
</style>
