<template>
    <div class="tarifes container">
        <h3 class="tarifes__title">Сервера</h3>
        <p class="tarifes__subtitle">Здесь вы можете скопировать ключ сервера и изменить набор стран своей подписки</p>
        <div class="tarifes__links">
            <!-- <a class="servers__link" href="#">
                <VoprosSVG />
                Как сменить сервер
                <LinkSVG />
            </a> -->
            <button class="servers__link" @click="toggleEditMode">
                <Pencel />
                {{ isEditMode ? 'Готово /user/keys/:tg_id' : 'Редактировать набор серверов в подписке' }}
            </button>

            <div class="servers__link-container" v-for="server in servers" :key="server.id">
                <button class="servers__link">
                    <Pencel />
                </button>
                <router-link v-if="!isEditMode" class="router-link"
                    :class="{ 'router-link_active': server.selected }" to="/tarifes">
                    <img :src="server.flag" :alt="server.country">
                    <span class="router-link__text">
                        <span class="router-link__duration">{{ server.country }}</span>
                        <span class="router-link__price">{{ server.city }}</span>
                    </span>
                    <CircleArrowSVG />
                </router-link>
            </div>

            <div v-for="server in servers" v-if="isEditMode" :key="`edit-${server.id}`" class="router-link"
                :class="{ 'router-link_active': server.selected }">
                <img :src="server.flag" :alt="server.country">
                <span class="router-link__text">
                    <span class="router-link__duration">{{ server.country }}</span>
                    <span class="router-link__price">{{ server.city }}</span>
                </span>
                <Checkbox :modelValue="server.selected"
                    @update:modelValue="(value) => handleServerSelect(server.id, value)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Checkbox from "../components/ui/Checkbox.vue";
import CircleArrowSVG from "../components/icons/CircleArrowSVG.vue";
import VoprosSVG from "../components/icons/VoprosSVG.vue";
import LinkSVG from "../components/icons/LinkSVG.vue";
import Pencel from "../components/icons/Pencel.vue";
import { onMounted, ref } from 'vue';

// Состояние режима редактирования
const isEditMode = ref(false)

// Данные серверов с их состоянием выбора
const servers = ref([
    { id: 1, country: 'Канада', city: 'Виктория', flag: 'img/canada.png', selected: false },
    { id: 2, country: 'Германия', city: 'Берлин', flag: 'img/germany.png', selected: false },
    { id: 3, country: 'Исландия', city: 'Рекьявик', flag: 'img/iceland.png', selected: false },
    { id: 4, country: 'Великобритания', city: 'Лæууæндон', flag: 'img/united-kingdom.png', selected: false }, // активный сервер
    { id: 5, country: 'Вьетнам', city: 'Пхукет', flag: 'img/viet-nam.png', selected: false },
    { id: 6, country: 'Канада', city: 'Оттава', flag: 'img/canada.png', selected: false },
    { id: 7, country: 'Германия', city: 'Берлин', flag: 'img/germany.png', selected: false },
    { id: 8, country: 'Исландия', city: 'Рекьявик', flag: 'img/iceland.png', selected: false },
    { id: 9, country: 'Великобритания', city: 'Лæууæндон', flag: 'img/united-kingdom.png', selected: false }
])

// Переключение режима редактирования
const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value
}

// Обработка выбора сервера в режиме редактирования
const handleServerSelect = (serverId, value) => {
    const serverIndex = servers.value.findIndex(s => s.id === serverId)
    if (serverIndex !== -1) {
        servers.value[serverIndex] = {
            ...servers.value[serverIndex],
            selected: value
        }
    }
}

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

    .servers__link-container {
        display: grid;
        grid-template-columns: 60px 1fr;
        gap: 10px;
    }

    .servers__link {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 52px;
        width: 100%;
        color: #fff;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 6px;
        text-decoration: none;
        padding: 10px;
        transition: .3s;
        cursor: pointer;

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

    button.servers__link {
        svg {
            &:last-of-type {
                margin-left: 0;
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
        cursor: pointer;

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

        &>span {
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
