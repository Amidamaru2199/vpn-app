<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Продление подписки</h3>
        <p class="tarifes__subtitle">Выберите тариф:</p>
        
        <!-- Обычные тарифы -->
        <div v-if="visibleRegularTariffs.length > 0" class="tarifes__payment-section">
            <h4 class="tarifes__payment-title">
                <span class="tarifes__ruble-icon">₽</span>
                Оплата картой или по СБП
            </h4>
            <div class="tarifes__links">
            <RouterLink component="div" v-for="tariff in visibleRegularTariffs" :key="tariff.id"
                @click="createPayment(tariff.id, tariff.is_crypto)">
                <template #text>
                    <div class="tarifes__router-link-text">
                        <span class="tarifes__router-link-duration">{{ tariff.name }} за {{ tariff.price }} руб.</span>
                        <span class="tarifes__router-link-price">{{ daysFormatter(tariff) }} руб в месяц</span>
                    </div>
                </template>
                </RouterLink>
            </div>
        </div>
        
        <!-- Крипто тарифы -->
        <div v-if="visibleCryptoTariffs.length > 0" class="tarifes__crypto-section">
            <h4 class="tarifes__crypto-title">
                <span class="tarifes__crypto-icon">₿</span>
                Оплата криптовалютой
            </h4>
            <div class="tarifes__links">
                <RouterLink component="div" v-for="tariff in visibleCryptoTariffs" :key="tariff.id"
                    @click="createPayment(tariff.id, tariff.is_crypto)"
                    class="router-link--crypto">
                    <template #text>
                        <div class="tarifes__router-link-text">
                            <span class="tarifes__router-link-duration">{{ tariff.name }} за {{ tariff.price }} руб.</span>
                            <span class="tarifes__router-link-price">{{ daysFormatter(tariff) }} руб в месяц</span>
                        </div>
                    </template>
                </RouterLink>
            </div>
        </div>
        
        <div v-if="visibleRegularTariffs.length === 0 && visibleCryptoTariffs.length === 0" class="tarifes__title">
            <p>Нет доступных тарифов</p>
        </div>
        
        <div class="tarifes__text">
            <p>Оплата картой подключает автоплатёж. В настройках вы можете его отключить и указать email для получения чеков.</p>
        </div>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import { onMounted, computed } from 'vue';
import { useUsersStore } from "../stores";
import { useTelegram } from "../composables/useTelegram";
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'

const router = useRouter()
const usersStore = useUsersStore();
const { userId, initTelegram, showBackButton } = useTelegram();
const { error: showError } = useToast()

const visibleRegularTariffs = computed(() => {
    return usersStore.regularTariffs.filter(tariff => !tariff.is_hidden)
})

const visibleCryptoTariffs = computed(() => {
    return usersStore.cryptoTariffs.filter(tariff => !tariff.is_hidden)
})

const daysFormatter = (tariff) => {
    return Math.round(tariff.price / (tariff.days / 30))
}

const createPayment = async (tariff_id, isCrypto) => {
    if (!userId.value) {
        showError('Ошибка: Telegram ID не найден')
        return
    }
    
    if (isCrypto) {
        // Находим тариф для получения деталей
        const tariff = usersStore.cryptoTariffs.find(t => t.id === tariff_id)
        if (!tariff) {
            showError('Тариф не найден')
            return
        }
        
        // Создаём крипто invoice
        const result = await usersStore.createCryptoPayment(
            userId.value,
            tariff_id,
            parseFloat(tariff.price),
            tariff.name
        )
        
        if (result && result.pay_url) {
            // Сохраняем данные invoice для отображения
            router.push({
                name: 'crypto-payment',
                query: {
                    pay_url: result.pay_url,
                    amount: tariff.price,
                    tariff_name: tariff.name
                }
            })
        } else {
            showError('Не удалось создать счёт на оплату')
        }
    } else {
        // Обычная оплата картой
        await usersStore.createPayment(userId.value, tariff_id)

        if (usersStore.payments?.confirmation?.confirmation_url) {
            const confirmationUrl = usersStore.payments.confirmation.confirmation_url

            const tg = window.Telegram?.WebApp
            if (tg && tg.openLink) {
                tg.openLink(confirmationUrl)
            } else {
                window.open(confirmationUrl, '_blank')
            }
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

    &__payment-section {
        margin-bottom: 0;
    }

    &__payment-title {
        font-size: 18px;
        font-weight: 500;
        color: $primary-color;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    &__ruble-icon {
        font-size: 20px;
        line-height: 1;
    }

    &__crypto-section {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    &__crypto-title {
        font-size: 18px;
        font-weight: 500;
        color: $primary-color;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    &__crypto-icon {
        font-size: 20px;
        line-height: 1;
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
    
    &__ruble-icon {
        font-size: 16px;
        line-height: 1;
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
