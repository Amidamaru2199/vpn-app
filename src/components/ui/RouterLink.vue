<template>
    <router-link class="router-link" :to="to">
        <slot name="icon" />
        <span>{{ text }}</span>
        <slot name="arrow">
            <CircleArrowSVG />
        </slot>
    </router-link>
</template>

<script setup>
import { defineProps } from 'vue';
import CircleArrowSVG from '../icons/CircleArrowSVG.vue';

const props = defineProps({
    to: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});
</script>

<style scoped lang="scss">
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

    &:hover {
        border: 1px solid #DBD6CE;
        background-color: rgba(255, 255, 255, 0.3);
    }

    span {
        margin: 0 auto 0 10px;
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
}

@keyframes shine {
    0% {
        left: -75%;
    }

    100% {
        left: 125%;
    }
}
</style>