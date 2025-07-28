<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Быстрая настройка</h3>
        <p class="tarifes__subtitle">Процесс первичной настройки</p>
        <div class="tarifes__links">
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    <span class="router-link__duration">На 1 месяц за 99 руб.</span>
                    <span class="router-link__price">99 руб в месяц</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    <span class="router-link__duration">На 2 месяца за 199 руб.</span>
                    <span class="router-link__price">199 руб. в месяц</span>
                </span>
                <CircleArrowSVG />
            </router-link>
            <router-link class="router-link" to="/vpn-app/tarifes">
                <span class="router-link__text">
                    <span class="router-link__duration">На 6 месяцев за 399 руб.</span>
                    <span class="router-link__price">99 руб. в месяц</span>
                </span>
                <CircleArrowSVG />
            </router-link>
        </div>
        <div class="tarifes__text">
            <p>Если выбрать оплату картой, вам не придется каждый раз вводить данные заново, продление подписки будет осуществляться автоматически. Так же вы в любой момент можете отключить автопродление в настройках.</p>
            <p>Что бы получать чеки на почту, укажите ее в настройках.</p>
        </div>
    </div>
</template>

<script setup>
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
