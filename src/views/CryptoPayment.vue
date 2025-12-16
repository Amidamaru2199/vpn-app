<template>
    <div class="crypto-payment container">
        <div class="crypto-payment__header">
            <CryptoSVG class="crypto-payment__icon" />
            <h3 class="crypto-payment__title">Оплата криптовалютой</h3>
        </div>
        
        <div class="crypto-payment__info">
            <p class="crypto-payment__tariff">{{ tariffName }}</p>
            <p class="crypto-payment__amount">{{ amount }} ₽</p>
        </div>

        <div class="crypto-payment__instructions">
            <p>Нажмите кнопку ниже для перехода к оплате в CryptoBot</p>
        </div>

        <div class="crypto-payment__buttons">
            <button class="crypto-payment__btn crypto-payment__btn--primary" @click="openCryptoBot">
                <CryptoSVG />
                Открыть CryptoBot
            </button>
            
            <button class="crypto-payment__btn crypto-payment__btn--secondary" @click="copyPaymentLink">
                Скопировать ссылку
            </button>
        </div>

        <div class="crypto-payment__note">
            <p>⚡ После оплаты подписка активируется автоматически</p>
            <p>💡 Поддерживаются: USDT, TON, BTC, ETH и другие</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'
import { useClipboard } from '../composables/useClipboard'
import CryptoSVG from '../components/icons/CryptoSVG.vue'

const route = useRoute()
const router = useRouter()
const { showBackButton } = useTelegram()
const { copyToClipboard } = useClipboard()

const payUrl = ref(route.query.pay_url || '')
const amount = ref(route.query.amount || '0')
const tariffName = ref(route.query.tariff_name || 'Тариф')

const openCryptoBot = () => {
    const tg = window.Telegram?.WebApp
    
    // Пробуем открыть через Telegram API
    if (tg && tg.openLink && payUrl.value) {
        tg.openLink(payUrl.value)
    } else if (payUrl.value) {
        window.open(payUrl.value, '_blank')
    }
}

const copyPaymentLink = () => {
    if (payUrl.value) {
        copyToClipboard(payUrl.value, 'Ссылка на оплату скопирована!')
    } else {
        copyToClipboard('', 'Ссылка на оплату недоступна')
    }
}

onMounted(() => {
    showBackButton(() => {
        router.back()
    })
    
    // Проверяем наличие данных
    if (!payUrl.value) {
        console.error('Отсутствует ссылка на оплату')
    }
})
</script>

<style scoped lang="scss">
.crypto-payment {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 24px;

    &__header {
        text-align: center;
        margin-bottom: 24px;
    }

    &__icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        color: $primary-color;
        opacity: 0.9;
    }

    &__title {
        font-size: 24px;
        font-weight: 500;
        color: $primary-color;
        margin-bottom: 8px;
    }

    &__info {
        text-align: center;
        margin-bottom: 32px;
        padding: 20px;
        background: $background-color;
        border-radius: 12px;
        border: 1px solid $secondary-color;
        width: 100%;
        max-width: 400px;
    }

    &__tariff {
        font-size: 16px;
        color: $secondary-color;
        margin-bottom: 8px;
    }

    &__amount {
        font-size: 32px;
        font-weight: 600;
        color: $primary-color;
    }

    &__instructions {
        text-align: center;
        margin-bottom: 24px;
        color: $secondary-color;
        font-size: 14px;
        line-height: 1.5;
    }

    &__buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 400px;
        margin-bottom: 24px;
    }

    &__btn {
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        svg {
            width: 20px;
            height: 20px;
        }

        &--primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
        }

        &--secondary {
            background: $background-color;
            color: $primary-color;
            border: 1px solid $secondary-color;

            &:hover {
                background: $router-link-background-hover-color;
            }
        }
    }

    &__note {
        text-align: center;
        font-size: 12px;
        color: $secondary-color;
        line-height: 1.6;
        padding: 16px;
        background: $background-color;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;

        p {
            margin: 4px 0;
        }
    }
}
</style>
