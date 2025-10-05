<template>
  <label class="checkbox-wrapper" :class="{ disabled: disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="checkbox-input"
    />
    <span class="checkbox-custom" :class="{ checked: modelValue, disabled: disabled }">
      <svg
        v-if="modelValue"
        class="checkbox-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
          fill="currentColor"
        />
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
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
  
  &:hover:not(.disabled) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &.checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
    
    &:hover:not(.disabled) {
      background-color: #2563eb;
      border-color: #2563eb;
    }
  }
  
  &.disabled {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    cursor: not-allowed;
  }
}

.checkbox-icon {
  width: 14px;
  height: 14px;
  color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.checkbox-label {
  margin-left: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  
  .disabled & {
    color: #9ca3af;
  }
}

// Темная тема
@media (prefers-color-scheme: dark) {
  .checkbox-custom {
    background-color: #1f2937;
    border-color: #4b5563;
    
    &:hover:not(.disabled) {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }
    
    &.checked {
      background-color: #3b82f6;
      border-color: #3b82f6;
      
      &:hover:not(.disabled) {
        background-color: #2563eb;
        border-color: #2563eb;
      }
    }
    
    &.disabled {
      background-color: #374151;
      border-color: #4b5563;
    }
  }
  
  .checkbox-label {
    color: #d1d5db;
    
    .disabled & {
      color: #6b7280;
    }
  }
}
</style>