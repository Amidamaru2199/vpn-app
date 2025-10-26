<template>
    <div class="help container">
        <h3 class="help__title">Помощь</h3>
        <p class="help__subtitle">Тут ответы на все вопросы</p>
        <div class="help__links">
            <RouterLink v-for="link in helpLinks" :key="link.title" :to="link.link">
                <template #text>
                    <span class="help__router-link-text">
                        {{ link.title }}
                    </span>
                </template>
            </RouterLink>
        </div>
        <p class="help__questions">Не нашли ответ на свой вопрос?</p>
        <a class="help__servers-link" href="https://t.me/AdronVpn_Support_Bot">
            <TelegramSVG />
            Тех поддержка
        </a>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import TelegramSVG from '../components/icons/TelegramSVG.vue';
import { onMounted, ref } from 'vue';

const helpLinks = ref(
    [
        {
            title: 'Как настроить VPN на своём устройстве',
            link: 'https://telegra.ph/Kak-nastroit-VPN-na-svoyom-ustrojstve-10-23',
        },
        {
            title: 'Как настроить VPN на Android TV',
            link: 'https://telegra.ph/Kak-nastroit-VPN-na-Android-TV-10-26',
        },
        {
            title: 'Как подключить другое устройство по своей подписке',
            link: 'https://telegra.ph/Kak-podklyuchit-drugoe-ustrojstvo-po-svoej-podpiske-10-23',
        },
        {
            title: 'Как настроить VPN на Windows',
            link: 'https://telegra.ph/Kak-nastroit-na-Windows-10-26',
        },
        {
            title: 'Как выключить автоплатеж',
            link: 'https://telegra.ph/Kak-vyklyuchit-avtoplatyozh-10-24',
        },
    ]
)

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
