<template>
    <component :is="component" class="router-link" :to="to">
        <slot name="icon" />
        <span v-if="text">{{ text }}</span>
        <slot v-else name="text" />
        <slot name="arrow">
            <CircleArrowSVG />
        </slot>
    </component>
</template>

<script setup>
import { defineProps } from 'vue';
import CircleArrowSVG from '../icons/CircleArrowSVG.vue';

const props = defineProps({
    to: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    component: {
        type: String,
        required: false,
        default: 'router-link'
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
    min-height: 54px;
    background: $router-link-background-color;
    border: 1px solid $router-link-background-color;
    border-radius: 6px;
    color: $primary-color;
    text-decoration: none;
    padding-inline: 10px;
    overflow: hidden;
    transition: 0.3s;
    cursor: pointer;

    &_active {
        border: 1px solid $router-link-active-border-color;
        background: $router-link-active-background-color;

        .router-link__duration,
        .router-link__price {
            color: $primary-color;
        }
    }

    &:hover {
        border: 1px solid $router-link-active-border-color;
        background-color: $router-link-background-hover-color;
    }

    &_main {
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: $router-link-main-color;
            transform: skewX(-20deg);
            animation: shine 3.2s infinite;
        }
    }

    span {
        margin: 0 auto 0 10px;
    }

    &>span {
        margin: 0 auto 0 10px;
    }

    img {
        height: 35px;
    }

    svg {
        width: 32px;
        height: 32px;
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