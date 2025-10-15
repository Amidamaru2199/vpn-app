<template>
    <label class="switch">
        <input 
            type="checkbox" 
            :checked="modelValue"
            @change="handleChange"
        >
        <span class="switch__slider"></span>
    </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
    emit('update:modelValue', event.target.checked)
}
</script>

<style scoped lang="scss">
.switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
    cursor: pointer;

    input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .switch__slider {
            background-color: $background-red-color;
        }

        &:checked + .switch__slider:before {
            transform: translateX(22px);
        }

        &:focus + .switch__slider {
            box-shadow: 0 0 1px $background-red-color;
        }
    }

    &__slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $router-link-background-hover-color;
        transition: 0.3s;
        border-radius: 26px;

        &:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.4);
        }
    }
}
</style>

