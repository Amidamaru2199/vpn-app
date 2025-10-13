<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Быстрая настройка</h3>
        <p class="tarifes__subtitle">Процесс первичной настройки</p>
        <div class="tarifes__links">
            <RouterLink component="div" v-for="tariff in usersStore.allTariffs" :key="tariff.id"
                @click="createPayment(tariff.id)">
                <template #text>
                    <div class="tarifes__router-link-text">
                        <span class="tarifes__router-link-duration">{{ tariff.name }} за {{ tariff.price }} руб.</span>
                        <span class="tarifes__router-link-price">{{ tariff.price }} руб в месяц</span>
                    </div>
                </template>
            </RouterLink>
        </div>
        <div class="tarifes__text">
            <p>Если выбрать оплату картой, вам не придется каждый раз вводить данные заново, продление подписки будет
                осуществляться автоматически. Так же вы в любой момент можете отключить автопродление в настройках.</p>
            <p>Что бы получать чеки на почту, укажите ее в настройках.</p>
        </div>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import { onMounted } from 'vue';
import { useUsersStore } from "../stores";
import { useTelegram } from "../composables/useTelegram";

const usersStore = useUsersStore();
const { userId } = useTelegram();

const createPayment = async (tariff_id) => {
await usersStore.createPayment(userId, tariff_id)
    
        const confirmationUrl = usersStore.payments.confirmation.confirmation_url

        const tg = window.Telegram?.WebApp
        if (tg && tg.openLink) {
            tg.openLink(confirmationUrl)
        } else {
            window.open(confirmationUrl, '_blank')
        }
}

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
.tarifes {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__title {
        font-size: 24px;
        line-height: 150%;
        margin-bottom: 5px;
        color: #fff;
    }

    &__subtitle {
        font-size: 14px;
        line-height: 150%;
        margin-bottom: 24px;
        color: #D0CBC3;
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

    &__router-link-duration {
        font-size: 14px;
        line-height: 150%;
        color: #D0CBC3;
    }

    &__router-link-price {
        font-size: 12px;
        line-height: 150%;
        color: #D0CBC3;
    }

    &__text {
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
