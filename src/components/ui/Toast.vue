<!-- <template>
    <Transition name="toast">
        <div v-if="visible" class="toast" :class="`toast--${type}`">
            <div class="toast__content">
                <span v-if="type !== 'modal'" class="toast__icon">{{ icon }}</span>
                <span class="toast__message">{{ message }}</span>
            </div>
            <button class="toast__close" @click="hide">×</button>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'info', // 'success', 'error', 'warning', 'info', 'modal'
        validator: (value) => ['success', 'error', 'warning', 'info', 'modal'].includes(value)
    },
    duration: {
        type: Number,
        default: 3000
    }
})

const visible = ref(false)
let timer = null

const icon = computed(() => {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }
    return icons[props.type] || icons.info
})

const show = () => {
    visible.value = true

    if (props.duration > 0) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            hide()
        }, props.duration)
    }
}

const hide = () => {
    visible.value = false
    clearTimeout(timer)
}

defineExpose({
    show,
    hide
})
</script>

<style scoped lang="scss">
.toast {
    position: fixed;
    top: 20px;
    right: 14px;
    min-width: 280px;
    max-width: calc(100% - 28px);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px $shadow-color;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    backdrop-filter: blur(10px);

    &__content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }

    &__icon {
        font-size: 20px;
        font-weight: bold;
        flex-shrink: 0;
    }

    &__message {
        font-size: 14px;
        line-height: 1.4;
        word-break: break-word;
    }

    &__close {
        background: none;
        border: none;
        color: inherit;
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
        flex-shrink: 0;

        &:hover {
            opacity: 1;
        }
    }

    &--success {
        background: $success-gradient-color;
        color: $primary-color;
    }

    &--error {
        background: $error-gradient-color;
        color: $primary-color;
    }

    &--warning {
        background: $warning-gradient-color;
        color: $primary-color;
    }

    &--info {
        background: $info-gradient-color;
        color: $primary-color;
    }

    &--modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 320px;
        max-width: 90vw;
        background: rgba(0, 0, 0, 0.9);
        color: $primary-color;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        z-index: 10000;
        
        .toast__content {
            justify-content: center;
            text-align: center;
        }
        
        .toast__message {
            font-size: 16px;
            font-weight: 500;
        }
        
        .toast__close {
            position: absolute;
            top: 12px;
            right: 12px;
            font-size: 20px;
            opacity: 0.8;
            
            &:hover {
                opacity: 1;
            }
        }
    }
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

// Специальные анимации для модального тоста
.toast--modal.toast-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
}

.toast--modal.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
}
</style> -->
