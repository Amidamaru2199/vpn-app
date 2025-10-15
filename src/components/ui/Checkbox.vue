<template>
    <label class="checkbox-wrapper" :class="{ disabled: disabled }">
        <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="handleChange"
            class="checkbox-input" />
        <span class="checkbox-custom" :class="{ checked: modelValue, disabled: disabled }">
            <svg v-if="modelValue" class="checkbox-icon" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
            </svg>
        </span>
        <span v-if="label" class="checkbox-label">{{ label }}</span>
    </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (event) => {
    if (!props.disabled) {
        emit('update:modelValue', event.target.checked)
        emit('change', event.target.checked)
    }
}
</script>

<style scoped lang="scss">
.checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

.checkbox-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkbox-custom {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid $checkbox-border-disabled-color;
    border-radius: 4px;
    background-color: $primary-color;
    transition: all 0.2s ease-in-out;
    flex-shrink: 0;

    &:hover:not(.disabled) {
        border-color: $checkbox-primary-color;
        box-shadow: 0 0 0 3px $shadow-color;
    }

    &.checked {
        background-color: $checkbox-primary-color;
        border-color: $checkbox-primary-color;

        &:hover:not(.disabled) {
            background-color: $checkbox-blue-color;
            border-color: $checkbox-blue-color;
        }
    }

    &.disabled {
        background-color: $checkbox-background-disabled-color;
        border-color: $checkbox-border-disabled-color;
        cursor: not-allowed;
    }
}

.checkbox-icon {
    width: 14px;
    height: 14px;
    color: $primary-color;
    transition: all 0.2s ease-in-out;
}

.checkbox-label {
    margin-left: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: $secondary-color;

    .disabled & {
        color: $checkbox-label-disabled-color;
    }
}
</style>