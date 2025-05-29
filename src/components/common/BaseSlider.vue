<template>
  <div class="base-slider-wrapper">
    <label v-if="label" :for="sliderId" class="base-slider-label">
      {{ label }}
      <span v-if="showValue" class="slider-value">{{ displayValue }}</span>
    </label>
    
    <div class="base-slider-container" :class="containerClasses">
      <span v-if="showMinMax" class="slider-min">{{ min }}</span>
      
      <div class="slider-track-container">
        <div class="slider-track" ref="trackRef">
          <div class="slider-progress" :style="progressStyle"></div>
          <input
            :id="sliderId"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="modelValue"
            :disabled="disabled"
            class="slider-input"
            @input="handleInput"
            @change="handleChange"
          />
          <div class="slider-thumb" :style="thumbStyle"></div>
        </div>
        
        <div v-if="marks && marks.length" class="slider-marks">
          <div
            v-for="mark in marks"
            :key="mark.value"
            class="slider-mark"
            :style="getMarkStyle(mark.value)"
          >
            <div class="mark-dot"></div>
            <span v-if="mark.label" class="mark-label">{{ mark.label }}</span>
          </div>
        </div>
      </div>
      
      <span v-if="showMinMax" class="slider-max">{{ max }}</span>
    </div>
    
    <div v-if="helperText" class="base-slider-helper">
      <span class="helper-text">{{ helperText }}</span>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'BaseSlider',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: true
    },
    showMinMax: {
      type: Boolean,
      default: false
    },
    helperText: {
      type: String,
      default: null
    },
    marks: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger'].includes(value)
    },
    valueFormatter: {
      type: Function,
      default: null
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const trackRef = ref(null)
    const sliderId = `slider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const containerClasses = computed(() => [
      'base-slider-container',
      `base-slider-container--${props.size}`,
      `base-slider-container--${props.color}`,
      {
        'base-slider-container--disabled': props.disabled
      }
    ])

    const percentage = computed(() => {
      return ((props.modelValue - props.min) / (props.max - props.min)) * 100
    })

    const progressStyle = computed(() => ({
      width: `${Math.min(100, Math.max(0, percentage.value))}%`
    }))

    const thumbStyle = computed(() => ({
      left: `${Math.min(100, Math.max(0, percentage.value))}%`
    }))

    const displayValue = computed(() => {
      if (props.valueFormatter) {
        return props.valueFormatter(props.modelValue)
      }
      return props.modelValue
    })

    const getMarkStyle = (value) => {
      const markPercentage = ((value - props.min) / (props.max - props.min)) * 100
      return {
        left: `${Math.min(100, Math.max(0, markPercentage))}%`
      }
    }

    const handleInput = (event) => {
      const value = parseFloat(event.target.value)
      emit('update:modelValue', value)
    }

    const handleChange = (event) => {
      const value = parseFloat(event.target.value)
      emit('change', value)
    }

    return {
      trackRef,
      sliderId,
      containerClasses,
      progressStyle,
      thumbStyle,
      displayValue,
      getMarkStyle,
      handleInput,
      handleChange
    }
  }
}
</script>

<style scoped>
.base-slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.base-slider-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-value {
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.base-slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.base-slider-container--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-min,
.slider-max {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  min-width: fit-content;
}

.slider-track-container {
  flex: 1;
  position: relative;
}

.slider-track {
  position: relative;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.base-slider-container--small .slider-track {
  height: 4px;
}

.base-slider-container--large .slider-track {
  height: 8px;
}

.slider-progress {
  height: 100%;
  background: #6366f1;
  border-radius: 3px;
  transition: width 0.2s ease;
}

.base-slider-container--primary .slider-progress {
  background: #6366f1;
}

.base-slider-container--secondary .slider-progress {
  background: #64748b;
}

.base-slider-container--success .slider-progress {
  background: #10b981;
}

.base-slider-container--danger .slider-progress {
  background: #ef4444;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  -webkit-appearance: none;
}

.slider-input:disabled {
  cursor: not-allowed;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid #6366f1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.base-slider-container--small .slider-thumb {
  width: 16px;
  height: 16px;
}

.base-slider-container--large .slider-thumb {
  width: 24px;
  height: 24px;
}

.base-slider-container--primary .slider-thumb {
  border-color: #6366f1;
}

.base-slider-container--secondary .slider-thumb {
  border-color: #64748b;
}

.base-slider-container--success .slider-thumb {
  border-color: #10b981;
}

.base-slider-container--danger .slider-thumb {
  border-color: #ef4444;
}

.slider-input:hover + .slider-thumb:not(.base-slider-container--disabled .slider-thumb) {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.slider-input:focus + .slider-thumb {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.slider-marks {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
}

.slider-mark {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.mark-dot {
  width: 6px;
  height: 6px;
  background: #d1d5db;
  border-radius: 50%;
  margin-top: 2px;
}

.mark-label {
  font-size: 0.7rem;
  color: #6b7280;
  white-space: nowrap;
}

.base-slider-helper {
  font-size: 0.8rem;
}

.helper-text {
  color: #6b7280;
}

/* 반응형 */
@media (max-width: 768px) {
  .base-slider-container {
    gap: 0.5rem;
  }
  
  .slider-min,
  .slider-max {
    font-size: 0.75rem;
  }
  
  .mark-label {
    font-size: 0.65rem;
  }
}
</style> 