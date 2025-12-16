<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Продление подписки</h3>
        <p class="tarifes__subtitle">Выберите тариф:</p>
        <div v-if="usersStore.allTariffs.length > 0" class="tarifes__links">
            <RouterLink component="div" v-for="tariff in usersStore.allTariffs" :key="tariff.id"
                @click="createPayment(tariff.id)">
                <template #text>
                    <div class="tarifes__router-link-text">
                        <span class="tarifes__router-link-duration">{{ tariff.title }}</span>
                        <span v-if="tariff.discount" class="tarifes__router-link-price">{{ tariff.discount }}</span>
                    </div>
                </template>
            </RouterLink>
        </div>
        <div v-else class="tarifes__title">
            <p>Нет доступных тарифов</p>
        </div>
        <div class="tarifes__text">
            <p>Оплата картой подключает автоплатёж. В настройках вы можете его отключить и указать email для получения чеков.</p>
        </div>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import { onMounted } from 'vue';
import { useUsersStore } from "../stores";
import { useTelegram } from "../composables/useTelegram";
import { useToast } from '../composables/useToast'

const usersStore = useUsersStore();
const { userId, initTelegram, showBackButton } = useTelegram();
const { error: showError } = useToast()

const createPayment = async (tariff_id) => {
    if (!userId.value) {
        showError('Ошибка: Telegram ID не найден 5')
        return
    }
    
    await usersStore.createPayment(userId.value, tariff_id)

    if (usersStore.payments) {
        const confirmationUrl = usersStore.payments

        const tg = window.Telegram?.WebApp
        if (tg && tg.openLink) {
            tg.openLink(confirmationUrl)
        } else {
            window.open(confirmationUrl, '_blank')
        }
    }
}

onMounted(() => {
    initTelegram()
    
    showBackButton(() => {
        window.history.back()
    })
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

    &__router-link-duration {
        font-size: 14px;
        line-height: 150%;
        color: $primary-color;
    }

    &__router-link-price {
        font-size: 12px;
        line-height: 150%;
        color: $secondary-color;
    }

    &__text {
        font-size: 12px;
        line-height: 150%;
        color: $secondary-color;
        border: 1px solid $secondary-color;
        border-radius: 4px;
        margin-top: 32px;
        padding: 5px;
        background: $background-color;

        p {
            font-size: 14px;
        }
    }
}
</style>
