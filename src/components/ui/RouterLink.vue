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

    &_active {
        border: 1px solid #DBD6CE;
        background: linear-gradient(to right, #e53935, #f76c6c);

        .router-link__duration,
        .router-link__price {
            color: #fff;
        }
    }

    &:hover {
        border: 1px solid #DBD6CE;
        background-color: rgba(255, 255, 255, 0.3);
    }

    &_main {
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