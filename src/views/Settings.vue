<template>
    <div class="settings container">
        <h3 class="settings__title">Настройки</h3>
        <p class="settings__subtitle">Управление вашим аккаунтом</p>

        <div class="settings__info">
            <div class="settings__item">
                <span class="settings__value">Автоплатежи</span>
                <Switch :modelValue="usersStore.autoPayments" @update:modelValue="toggleAutoPayments" />
            </div>
        </div>

        <div class="settings__info">
            <form action="#" @submit.prevent="updateEmail">
            <div class="settings__item settings__item_column">
                <span class="settings__value">Email для чеков</span>
                <label class="settings__label" for="email">Укажите email, на который будут отправляться чеки после
                    оплаты</label>
                <input class="settings__input" id="email" name="email" type="email" v-model="email"
                    placeholder="example@example.com" />
                <button class="settings__button" type="submit">Сохранить</button>
            </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'
import { usePlatform } from '../composables/usePlatform'
import { useUsersStore } from '../stores/index.js'
import { useToast } from '../composables/useToast'
import Switch from '../components/ui/Switch.vue'

const router = useRouter()
const usersStore = useUsersStore()
const { userId, initTelegram, showBackButton } = useTelegram()
const { detectPlatform } = usePlatform()
const { error: showError } = useToast()
const email = ref('')

const toggleAutoPayments = async (value) => {
    if (!userId.value) {
        showError('Ошибка: Telegram ID не найден')
        return
    }

    await usersStore.updateAutoPaymentsSettings(userId.value, value)
}

const updateEmail = async () => {
    if (!userId.value) {
        showError('Ошибка: Telegram ID не найден')
        return
    }

    await usersStore.updateEmailSettings(userId.value, email.value)
}

onMounted(() => {
    detectPlatform()
    initTelegram()

    showBackButton(() => {
        router.back()
    })
})
</script>

<style scoped lang="scss">
.settings {
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

    &__info {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 20px;
    }

    &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        &_column {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        &:last-child {
            border-bottom: none;
        }
    }

    &__button {
        width: 100%;
        min-height: 54px;
        background: #E94245;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: 0.3s;

        &:hover {
            background: #e64b4e;
        }
    }

    &__input {
        width: 100%;
        min-height: 54px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        padding-inline: 10px;
        transition: 0.3s;
    }

    &__label {
        font-size: 14px;
        color: #D0CBC3;
    }

    &__value {
        font-size: 14px;
        color: #fff;
        font-weight: 500;
    }
}
</style>
