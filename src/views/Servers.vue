<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Сервера</h3>
        <p class="tarifes__subtitle">Нажмитие на сервер, что бы сменить страну</p>
        <div class="tarifes__links">
            <a class="servers__link" href="#">
                <VoprosSVG />
                Как сменить сервер
                <LinkSVG />
            </a>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/canada.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Канада</span>
                    <span class="router-link__price">Виктория</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/germany.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Германия</span>
                    <span class="router-link__price">Берлин</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/iceland.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Исландия</span>
                    <span class="router-link__price">Рекьявик</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link router-link_active" to="/vpn-app/tarifes">
                <img src="/img/united-kingdom.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Великобритания</span>
                    <span class="router-link__price">Лæууæндон</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/viet-nam.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Вьетнам</span>
                    <span class="router-link__price">Пхукет</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/canada.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Канада</span>
                    <span class="router-link__price">Оттава</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/germany.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Германия</span>
                    <span class="router-link__price">Берлин</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/iceland.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Исландия</span>
                    <span class="router-link__price">Рекьявик</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <img src="/img/united-kingdom.png" alt="flag">
                <span class="router-link__text">
                    <span class="router-link__duration">Великобритания</span>
                    <span class="router-link__price">Лæууæндон</span>
                </span>
                <CircleArrowSVG />
            </router-link>
        </div>
    </div>
</template>

<script setup>
import CircleArrowSVG from "../components/icons/CircleArrowSVG.vue";
import VoprosSVG from "../components/icons/VoprosSVG.vue";
import LinkSVG from "../components/icons/LinkSVG.vue";
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

    .servers__link {
        display: inline-flex;
        align-items: center;
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

            &:last-of-type {
                margin-left: auto;
            }
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

        &_active {
            border: 1px solid #DBD6CE;
            background: linear-gradient(to right, #e53935, #f76c6c);

            .router-link__duration,
            .router-link__price {
                color: #fff;
            }
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

        & > span {
            margin: 0 auto 0 10px;
        }

        img {
            height: 35px;
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
}
</style>
