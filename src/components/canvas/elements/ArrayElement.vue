<template>
  <g class="array-element">
    <!-- 배열 요소 배경 -->
    <rect
      :width="elementWidth"
      :height="elementHeight"
      :rx="borderRadius"
      :ry="borderRadius"
      :fill="backgroundColor"
      :stroke="borderColor"
      :stroke-width="borderWidth"
      class="element-background"
    />
    
    <!-- 인덱스 표시 -->
    <text
      v-if="showIndex"
      :x="elementWidth / 2"
      :y="-8"
      text-anchor="middle"
      font-size="11"
      fill="#6b7280"
      class="element-index"
    >
      [{{ element.index }}]
    </text>
    
    <!-- 값 표시/편집 -->
    <foreignObject
      v-if="editing"
      :x="4"
      :y="4"
      :width="elementWidth - 8"
      :height="elementHeight - 8"
      class="value-editor"
    >
      <input
        ref="editInput"
        v-model="editValue"
        type="number"
        :min="minValue"
        :max="maxValue"
        @blur="handleValueSubmit"
        @keydown.enter="handleValueSubmit"
        @keydown.escape="handleValueCancel"
        class="value-input"
      />
    </foreignObject>
    
    <text
      v-else
      :x="elementWidth / 2"
      :y="elementHeight / 2"
      text-anchor="middle"
      dominant-baseline="central"
      :font-size="fontSize"
      :font-weight="fontWeight"
      :fill="textColor"
      class="element-value"
    >
      {{ displayValue }}
    </text>
    
    <!-- 상태 표시 -->
    <circle
      v-if="element.state && element.state !== 'default'"
      :cx="elementWidth - 8"
      :cy="8"
      r="4"
      :fill="stateColor"
      class="state-indicator"
    />
    
    <!-- 애니메이션 효과 -->
    <rect
      v-if="element.highlighted"
      :width="elementWidth"
      :height="elementHeight"
      :rx="borderRadius"
      :ry="borderRadius"
      fill="none"
      stroke="#f59e0b"
      stroke-width="3"
      opacity="0.8"
      class="highlight-overlay"
    />
  </g>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'

export default {
  name: 'ArrayElement',
  props: {
    element: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['value-change'],
  setup(props, { emit }) {
    const editInput = ref(null)
    const editValue = ref('')
    
    // 요소 크기
    const elementWidth = computed(() => props.element.width || 60)
    const elementHeight = computed(() => props.element.height || 40)
    const borderRadius = computed(() => 4)
    
    // 스타일
    const backgroundColor = computed(() => {
      if (props.element.state === 'comparing') return '#fef3c7'
      if (props.element.state === 'swapping') return '#fecaca'
      if (props.element.state === 'sorted') return '#d1fae5'
      if (props.element.state === 'current') return '#dbeafe'
      if (props.selected) return '#eef2ff'
      return '#ffffff'
    })
    
    const borderColor = computed(() => {
      if (props.element.state === 'comparing') return '#f59e0b'
      if (props.element.state === 'swapping') return '#ef4444'
      if (props.element.state === 'sorted') return '#10b981'
      if (props.element.state === 'current') return '#3b82f6'
      if (props.selected) return '#6366f1'
      return '#d1d5db'
    })
    
    const borderWidth = computed(() => {
      return props.selected || props.element.state !== 'default' ? 2 : 1
    })
    
    const textColor = computed(() => {
      if (props.element.state === 'sorted') return '#047857'
      return '#374151'
    })
    
    const fontSize = computed(() => {
      const value = String(props.element.value || '')
      if (value.length > 3) return '12'
      return '14'
    })
    
    const fontWeight = computed(() => {
      return props.element.state !== 'default' ? '600' : '500'
    })
    
    const displayValue = computed(() => {
      return props.element.value ?? ''
    })
    
    const showIndex = computed(() => {
      return props.element.showIndex !== false && 
             props.element.index !== undefined
    })
    
    const stateColor = computed(() => {
      const stateColors = {
        comparing: '#f59e0b',
        swapping: '#ef4444',
        sorted: '#10b981',
        current: '#3b82f6',
        visited: '#8b5cf6'
      }
      return stateColors[props.element.state] || '#6b7280'
    })
    
    // 값 편집
    const minValue = computed(() => props.element.minValue || 1)
    const maxValue = computed(() => props.element.maxValue || 999)
    
    const handleValueSubmit = () => {
      const newValue = parseInt(editValue.value)
      if (!isNaN(newValue) && newValue >= minValue.value && newValue <= maxValue.value) {
        emit('value-change', newValue)
      } else {
        handleValueCancel()
      }
    }
    
    const handleValueCancel = () => {
      editValue.value = String(props.element.value || '')
      emit('value-change', props.element.value) // editing을 false로 만들기 위해
    }
    
    // 편집 모드가 활성화될 때 포커스
    onMounted(() => {
      if (props.editing && editInput.value) {
        nextTick(() => {
          editInput.value.focus()
          editInput.value.select()
        })
      }
    })
    
    // 편집 값 초기화
    if (props.editing) {
      editValue.value = String(props.element.value || '')
    }
    
    return {
      editInput,
      editValue,
      elementWidth,
      elementHeight,
      borderRadius,
      backgroundColor,
      borderColor,
      borderWidth,
      textColor,
      fontSize,
      fontWeight,
      displayValue,
      showIndex,
      stateColor,
      minValue,
      maxValue,
      handleValueSubmit,
      handleValueCancel
    }
  }
}
</script>

<style scoped>
.array-element {
  transition: all 0.2s ease;
}

.element-background {
  transition: all 0.2s ease;
}

.element-index {
  font-family: 'Consolas', 'Monaco', monospace;
  pointer-events: none;
}

.element-value {
  font-family: 'Consolas', 'Monaco', monospace;
  pointer-events: none;
  transition: all 0.2s ease;
  user-select: none;
}

.value-editor {
  pointer-events: auto;
}

.value-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  font-weight: 500;
  border-radius: 2px;
}

.state-indicator {
  pointer-events: none;
  animation: state-pulse 1s ease-in-out infinite alternate;
}

.highlight-overlay {
  pointer-events: none;
  animation: highlight-glow 0.8s ease-in-out infinite alternate;
}

@keyframes state-pulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

@keyframes highlight-glow {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style> 