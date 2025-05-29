<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="inputId" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="base-input-container" :class="containerClasses">
      <span v-if="prefixIcon" class="input-prefix-icon">{{ prefixIcon }}</span>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="$emit('enter', $event)"
      />
      
      <span v-if="suffixIcon" class="input-suffix-icon">{{ suffixIcon }}</span>
      
      <button 
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="input-clear-btn"
        @click="handleClear"
      >
        ❌
      </button>
    </div>
    
    <div v-if="error || helperText" class="base-input-helper">
      <span v-if="error" class="error-text">{{ error }}</span>
      <span v-else-if="helperText" class="helper-text">{{ helperText }}</span>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    helperText: {
      type: String,
      default: null
    },
    prefixIcon: {
      type: String,
      default: null
    },
    suffixIcon: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur', 'clear', 'enter'],
  setup(props, { emit }) {
    const isFocused = ref(false)
    const inputId = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const containerClasses = computed(() => [
      'base-input-container',
      `base-input-container--${props.size}`,
      {
        'base-input-container--focused': isFocused.value,
        'base-input-container--error': props.error,
        'base-input-container--disabled': props.disabled,
        'base-input-container--readonly': props.readonly,
        'base-input-container--full-width': props.fullWidth,
        'base-input-container--with-prefix': props.prefixIcon,
        'base-input-container--with-suffix': props.suffixIcon || props.clearable
      }
    ])

    const inputClasses = computed(() => [
      'base-input',
      `base-input--${props.size}`,
      {
        'base-input--with-prefix': props.prefixIcon,
        'base-input--with-suffix': props.suffixIcon || (props.clearable && props.modelValue)
      }
    ])

    const handleInput = (event) => {
      emit('update:modelValue', event.target.value)
    }

    const handleFocus = (event) => {
      isFocused.value = true
      emit('focus', event)
    }

    const handleBlur = (event) => {
      isFocused.value = false
      emit('blur', event)
    }

    const handleClear = () => {
      emit('update:modelValue', '')
      emit('clear')
    }

    return {
      inputId,
      containerClasses,
      inputClasses,
      handleInput,
      handleFocus,
      handleBlur,
      handleClear
    }
  }
}
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-input-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-mark {
  color: #ef4444;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}

.base-input-container:hover:not(.base-input-container--disabled) {
  border-color: #9ca3af;
}

.base-input-container--focused {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.base-input-container--error {
  border-color: #ef4444;
}

.base-input-container--error.base-input-container--focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.base-input-container--disabled {
  background: #f9fafb;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.base-input-container--readonly {
  background: #f9fafb;
}

.base-input-container--full-width {
  width: 100%;
}

/* 크기 변형 */
.base-input-container--small {
  min-height: 2rem;
}

.base-input-container--medium {
  min-height: 2.5rem;
}

.base-input-container--large {
  min-height: 3rem;
}

.base-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  color: #1f2937;
}

.base-input::placeholder {
  color: #9ca3af;
}

.base-input:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

/* 입력 크기 */
.base-input--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.base-input--medium {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.base-input--large {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

/* 아이콘이 있을 때 패딩 조정 */
.base-input--with-prefix {
  padding-left: 0.25rem;
}

.base-input--with-suffix {
  padding-right: 0.25rem;
}

/* 아이콘 스타일 */
.input-prefix-icon,
.input-suffix-icon {
  padding: 0 0.75rem;
  color: #6b7280;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.input-clear-btn {
  padding: 0.25rem;
  margin-right: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.75rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.input-clear-btn:hover {
  opacity: 1;
}

/* 도움말 텍스트 */
.base-input-helper {
  font-size: 0.8rem;
  line-height: 1.3;
}

.error-text {
  color: #ef4444;
}

.helper-text {
  color: #6b7280;
}

/* 반응형 */
@media (max-width: 768px) {
  .base-input--large {
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
  }
  
  .base-input--medium {
    padding: 0.5rem 0.625rem;
    font-size: 0.875rem;
  }
  
  .base-input--small {
    padding: 0.375rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style> 