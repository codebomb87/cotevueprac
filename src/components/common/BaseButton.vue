<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner">⏳</span>
    <span v-if="icon && !loading" class="button-icon">{{ icon }}</span>
    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'success', 'outline'].includes(value)
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
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonClasses = computed(() => [
      'base-button',
      `base-button--${props.variant}`,
      `base-button--${props.size}`,
      {
        'base-button--disabled': props.disabled,
        'base-button--loading': props.loading,
        'base-button--full-width': props.fullWidth,
        'base-button--icon-only': props.icon && !props.$slots?.default
      }
    ])

    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event)
      }
    }

    return {
      buttonClasses,
      handleClick
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

/* 크기 변형 */
.base-button--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.85rem;
  min-height: 2rem;
}

.base-button--medium {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-height: 2.5rem;
}

.base-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 3rem;
}

/* 색상 변형 */
.base-button--primary {
  background: #6366f1;
  color: white;
  border: 1px solid #6366f1;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background: #4f46e5;
  border-color: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

.base-button--secondary {
  background: #64748b;
  color: white;
  border: 1px solid #64748b;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background: #475569;
  border-color: #475569;
  transform: translateY(-1px);
}

.base-button--danger {
  background: #ef4444;
  color: white;
  border: 1px solid #ef4444;
}

.base-button--danger:hover:not(.base-button--disabled) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
}

.base-button--success {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
}

.base-button--success:hover:not(.base-button--disabled) {
  background: #059669;
  border-color: #059669;
  transform: translateY(-1px);
}

.base-button--outline {
  background: white;
  color: #6366f1;
  border: 1px solid #d1d5db;
}

.base-button--outline:hover:not(.base-button--disabled) {
  background: #f8fafc;
  border-color: #6366f1;
  transform: translateY(-1px);
}

/* 상태 */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.base-button--loading {
  cursor: wait;
}

.base-button--full-width {
  width: 100%;
}

.base-button--icon-only {
  aspect-ratio: 1;
  padding: 0.5rem;
}

/* 요소들 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

.button-icon {
  font-size: 1em;
}

.button-text {
  white-space: nowrap;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .base-button--large {
    padding: 0.625rem 1.25rem;
    font-size: 0.95rem;
  }
  
  .base-button--medium {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }
  
  .base-button--small {
    padding: 0.375rem 0.625rem;
    font-size: 0.8rem;
  }
}
</style> 