<template>
    <div class="servers container">
        <h3 class="servers__title">Сервера</h3>
        <p class="servers__subtitle">Здесь вы можете скопировать ключ сервера и изменить набор стран своей подписки</p>
        <div class="servers__links">
            <button class="servers__link" @click="toggleEditMode">
                <Pencel />
                <template v-if="isEditMode">
                    Готово ({{ usersStore.getSelectedServersCount() }}/{{ usersStore.servers?.max_servers || 6 }})
                </template>
                <template v-else>
                    Редактировать набор серверов в подписке
                </template>
            </button>

            <RouterLink component="div" v-for="server in usersStore.servers?.servers || []" :key="server.id"
                :class="{ 'router-link_active': server.is_main, 'router-link_clickable': isEditMode }"
                @click="isEditMode ? handleServerClick(server.id) : copyToClipboard(server.key, 'Ключ сервера скопирован!')">
                <template #icon>
                    <div class="servers-router-link__flag">
                        <template v-if="server.flag">
                            {{ server.flag }}
                        </template>
                        <template v-else>
                            {{ getFlagEmoji(server.code) }}
                        </template>
                    </div>
                </template>

                <template #text>
                    <div class="servers-router-link__text">
                        <div class="servers-router-link__text-container">
                            <span class="servers-router-link__duration">{{ server.country }}</span>
                            <span class="servers-router-link__price">{{ server.name }}</span>
                        </div>
                        <span class="servers-router-link__comment">{{ server.comment }}</span>
                    </div>
                </template>
                <template #arrow>
                    <Checkbox v-if="isEditMode" :modelValue="server.is_main" 
                        @update:modelValue="(value) => handleServerSelect(server.id, value)"
                        @click.stop />
                    <button class="servers__copy-button" v-else @click.stop="copyToClipboard(server.key, 'Ключ сервера скопирован!')">
                        <KeySVG />
                    </button>
                </template>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import Checkbox from "../components/ui/Checkbox.vue";
import KeySVG from "../components/icons/KeySVG.vue";
import Pencel from "../components/icons/Pencel.vue";
import { useUsersStore } from '../stores/index.js'
import { useTelegram } from '../composables/useTelegram'
import { useClipboard } from '../composables/useClipboard'
import { useToast } from '../composables/useToast'
import { usePlatform } from '../composables/usePlatform'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const { userId, initTelegram, showBackButton } = useTelegram()
const { copyToClipboard } = useClipboard()
const { error: showError } = useToast()
const { detectPlatform } = usePlatform()
const usersStore = useUsersStore()
const isEditMode = ref(false)

const getFlagEmoji = (code) => {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const toggleEditMode = async () => {
    if (isEditMode.value) {
        const currentSelectedCount = usersStore.getSelectedServersCount()
        
        if (currentSelectedCount < 1) {
            showError('Должен быть выбран хотя бы 1 сервер')
            return
        }
        
        if (!userId.value) {
            showError('Ошибка: Telegram ID не найден')
            return
        }
        
        const success = await usersStore.saveSelectedServers(userId.value)
        if (success) {
            isEditMode.value = false
        }
    } else {
        isEditMode.value = true
    }
}

const handleServerClick = (serverId) => {
    const server = usersStore.servers?.servers?.find(s => s.id === serverId)
    if (!server) return
    
    handleServerSelect(serverId, !server.is_main)
}

const handleServerSelect = (serverId, value) => {
    const maxServers = usersStore.servers?.max_servers || 6
    const currentSelectedCount = usersStore.getSelectedServersCount()
    
    if (value && currentSelectedCount >= maxServers) {
        showError(`Максимальное количество серверов: ${maxServers}. Сначала отключите другой сервер.`)
        return
    }
    
    if (!value && currentSelectedCount <= 1) {
        showError('Должен быть выбран хотя бы 1 сервер')
        return
    }
    
    usersStore.toggleServerSelection(serverId, value)
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
.servers {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__link-container {
        display: grid;
        grid-template-columns: 60px 1fr;
        gap: 10px;
    }

    &__link {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 54px;
        width: 100%;
        color: $primary-color;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 6px;
        text-decoration: none;
        padding: 10px;
        transition: .3s;
        cursor: pointer;

        &:hover {
            border: 1px solid $router-link-active-border-color;
            background-color: $router-link-background-hover-color;
        }

        svg {
            width: 25px;
            height: 25px;

            &:last-of-type {
                margin-left: auto;
            }
        }
    }

    button.servers__link {
        svg {
            &:last-of-type {
                margin-left: 0;
            }
        }
    }

    &__copy-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
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

    &-router-link__flag {
        font-size: 38px;
    }

    &-router-link__text {
        display: flex;
        gap: 24px;
        margin: 0 auto 0 10px;
    }

    &-router-link__text-container {
        display: flex;
        flex-direction: column;
    }

    &-router-link__comment,
    &-router-link__duration {
        font-size: 14px;
        line-height: 150%;
    }

    &-router-link__price {
        font-size: 12px;
        line-height: 150%;
    }
}
</style>
