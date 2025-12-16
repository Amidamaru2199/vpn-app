<template>
    <div 
        ref="particleContainer"
        class="particle" 
        :class="{ 'particle--particles-enabled': isGlowEnabled }"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
    >
        <div class="particle__text-content">
            <!-- <p class="particle__title">Подписка активна</p> -->
            <h3 class="particle__subtitle">{{ subscriptionStatus }}</h3>
        </div>
        <img class="particle__logo logo" id="logo" src="/img/smaspx.png" alt="">
        
        <!-- Динамические летящие частицы (только для тестового юзера) -->
        <div v-if="isGlowEnabled" class="particle__flying">
            <span 
                v-for="particle in flyingParticles" 
                :key="particle.id" 
                class="particle__dot"
                :style="{
                    left: particle.x + 'px',
                    top: particle.y + 'px',
                    '--angle': particle.angle + 'deg',
                }"
            ></span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { defineProps } from 'vue';
import { useTelegram } from '@/composables/useTelegram';

const props = defineProps({
    userSubscription: {
        type: String,
        default: ''
    },
    isSubscriptionExpired: {
        type: Boolean,
        default: false
    }
})

// Инициализация Telegram
const { userId, initTelegram } = useTelegram();
initTelegram();

// Эффект частиц включен для всех
const isGlowEnabled = computed(() => true);

// Реактивные данные для летящих частиц
const particleContainer = ref(null);
const flyingParticles = ref([]);
let particleId = 0;
let lastMousePosition = { x: 0, y: 0 };
let prevMousePosition = { x: 0, y: 0 }; // Для вычисления направления
let isMouseMoving = false;
let mouseTimer = null;

// Создание частицы при движении мыши с учетом направления
const createParticle = (x, y, directionX, directionY) => {
    
    // Вычисляем угол направления движения курсора
    let baseAngle = Math.atan2(directionY, directionX) * (180 / Math.PI);
    
    // Если нет движения - случайный угол
    if (Math.abs(directionX) < 0.1 && Math.abs(directionY) < 0.1) {
        baseAngle = Math.random() * 360;
    }
    
    // Добавляем случайное отклонение ±80 градусов для широкого разброса
    const randomSpread = (Math.random() - 0.5) * 160; // от -80 до +80
    const angle = baseAngle + randomSpread;
    
    const particle = {
        id: particleId++,
        x,
        y,
        angle,
    };
    
    flyingParticles.value.push(particle);
    
    // Удаляем частицу через 2 секунды (время дальнего полёта)
    setTimeout(() => {
        const index = flyingParticles.value.findIndex(p => p.id === particle.id);
        if (index > -1) {
            flyingParticles.value.splice(index, 1);
        }
    }, 2000);
};

// Обработчик движения мыши
const onMouseMove = (e) => {
    if (!isGlowEnabled.value) return;
    
    const rect = particleContainer.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Вычисляем вектор направления движения
    const directionX = x - lastMousePosition.x;
    const directionY = y - lastMousePosition.y;
    
    // Проверяем что мышь двигается (не стоит на месте)
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    
    // Создаем частицу только если мышь двигается и не слишком много частиц
    if (distance > 4 && flyingParticles.value.length < 50) {
        createParticle(x, y, directionX, directionY);
        prevMousePosition = { ...lastMousePosition };
        lastMousePosition = { x, y };
    }
    
    // Отмечаем что мышь двигается
    isMouseMoving = true;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
};

// Очистка частиц при уходе мыши
const onMouseLeave = () => {
    flyingParticles.value = [];
};

// Обработчик касаний для мобильных (touch)
const onTouchMove = (e) => {
    if (!isGlowEnabled.value) return;
    
    // Предотвращаем скролл страницы при движении по логотипу
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = particleContainer.value.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Вычисляем вектор направления движения
    const directionX = x - lastMousePosition.x;
    const directionY = y - lastMousePosition.y;
    
    // Проверяем что палец двигается
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    
    // Создаем частицу только если палец двигается
    if (distance > 4 && flyingParticles.value.length < 50) {
        createParticle(x, y, directionX, directionY);
        prevMousePosition = { ...lastMousePosition };
        lastMousePosition = { x, y };
    }
};

// Очистка при завершении касания
const onTouchEnd = () => {
    flyingParticles.value = [];
};

// Computed свойство для определения статуса подписки
const subscriptionStatus = computed(() => {
    if (!props.userSubscription) {
        return 'Подписка не найдена'
    }
    
    if (props.isSubscriptionExpired) {
        return 'Подписка истекла. Продлите её в разделе «Тарифы»'
    } else {
        return `Подписка активна до ${props.userSubscription}`
    }
})

// Computed свойство для определения, истекла ли подписка (используем переданный пропс)
const isSubscriptionExpired = computed(() => props.isSubscriptionExpired)

let nextParticle = null;

onMounted(() => {
    // Проверяем доступность библиотеки NextParticle
    if (typeof NextParticle !== 'undefined' && document.getElementById('logo')) {
        try {
            nextParticle = new NextParticle({
                image: document.getElementById('logo'),
                addTimestamp: true,
                width: window.innerWidth,
                height: 300,
                particleGap: 1,
                mouseForce: 20
            });
        } catch (error) {
            console.error('NextParticle initialization error:', error);
        }
    }
});
</script>

<style scoped lang="scss">
.particle {
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    overflow: visible; // Позволяем частицам вылетать за границы
    margin: -22px -14px 25px;
    z-index: 1;

    &__text-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: -25px;
        position: relative;
        z-index: 1;
    }

    &__logo {
        max-height: 300px;
        object-fit: cover;
        max-width: 310px;
        margin-inline: auto;
        position: relative;
        z-index: 1;
    }
    
    // Canvas с частицами
    :deep(canvas) {
        position: relative;
        z-index: 1;
    }

    &__title {
        font-size: 32px;
        color: $primary-color;
        line-height: 1;
        padding-inline: 14px;
        text-align: center;
    }

    &__subtitle {
        font-size: 14px;
        color: $secondary-color;
        line-height: 150%;
        padding-inline: 14px;
        text-align: center;
    }
    
    // ✨ ЛЕТЯЩИЕ ЧАСТИЦЫ 
    &--particles-enabled {
        .particle__flying {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
            overflow: visible;
        }
        
        .particle__dot {
            position: absolute;
            width: 4px;  // Чуть меньше для аккуратности
            height: 4px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--color-start), var(--color-end));
            box-shadow: 0 0 4px var(--color-start),
                        0 0 8px var(--color-end);  // Меньше blur - чётче
            animation: particle-fly-out 2s ease-out forwards;
            opacity: 0;
        }
    }
}

// Анимация вылета частицы от места курсора (дальний полёт!)
@keyframes particle-fly-out {
    0% {
        transform: rotate(var(--angle)) translateX(0) scale(1.2);
        opacity: 0;
    }
    3% {
        opacity: 1;  // Быстрее появляются
    }
    15% {
        opacity: 1;
        transform: rotate(var(--angle)) translateX(100px) scale(1.1);
    }
    35% {
        opacity: 0.9;  // Дольше остаются яркими
        transform: rotate(var(--angle)) translateX(300px) scale(1);
    }
    65% {
        opacity: 0.6;
        transform: rotate(var(--angle)) translateX(500px) scale(0.8);
    }
    100% {
        opacity: 0;
        transform: rotate(var(--angle)) translateX(700px) scale(0.3);
    }
}
</style>