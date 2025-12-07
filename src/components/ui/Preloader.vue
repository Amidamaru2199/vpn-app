<template>
    <Transition name="preloader">
        <div v-if="isLoading" class="preloader">
            <div class="preloader__spinner"></div>
        </div>
    </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useUsersStore } from '../../stores/index.ts'

const props = defineProps({
    isInitializing: {
        type: Boolean,
        default: false
    }
})

const usersStore = useUsersStore()

const isLoading = computed(() => usersStore.isLoading || props.isInitializing)
</script>

<style scoped lang="scss">
.preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $preloader-bg-color;
    backdrop-filter: blur(5px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;

    &__spinner {
        width: 50px;
        height: 50px;
        border: 4px solid $preloader-spinner-color;
        border-top-color: $primary-color;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.preloader-enter-active,
.preloader-leave-active {
    transition: opacity 0.3s ease;
}

.preloader-enter-from,
.preloader-leave-to {
    opacity: 0;
}
</style>
