<template>
  <g class="string-char">
    <!-- 문자 배경 -->
    <rect
      :width="charWidth"
      :height="charHeight"
      :rx="borderRadius"
      :ry="borderRadius"
      :fill="backgroundColor"
      :stroke="borderColor"
      :stroke-width="borderWidth"
      class="char-background"
    />
    
    <!-- 인덱스 표시 -->
    <text
      v-if="showIndex"
      :x="charWidth / 2"
      :y="-8"
      text-anchor="middle"
      font-size="10"
      fill="#6b7280"
      class="char-index"
    >
      {{ element.index }}
    </text>
    
    <!-- 문자 값 표시/편집 -->
    <foreignObject
      v-if="editing"
      :x="2"
      :y="2"
      :width="charWidth - 4"
      :height="charHeight - 4"
      class="value-editor"
    >
      <input
        ref="editInput"
        v-model="editValue"
        type="text"
        maxlength="1"
        @blur="handleValueSubmit"
        @keydown.enter="handleValueSubmit"
        @keydown.escape="handleValueCancel"
        class="value-input"
      />
    </foreignObject>
    
    <text
      v-else
      :x="charWidth / 2"
      :y="charHeight / 2"
      text-anchor="middle"
      dominant-baseline="central"
      :font-size="fontSize"
      :font-weight="fontWeight"
      :fill="textColor"
      class="char-value"
    >
      {{ displayValue }}
    </text>
    
    <!-- 매칭 상태 표시 -->
    <circle
      v-if="element.state && element.state !== 'default'"
      :cx="charWidth - 6"
      :cy="6"
      r="3"
      :fill="stateColor"
      class="state-indicator"
    />
    
    <!-- 패턴 길이 표시 (패턴의 첫 번째 문자인 경우) -->
    <path
      v-if="element.patternLength && element.patternStart"
      :d="`M 0 ${charHeight + 5} L ${element.patternLength * charWidth} ${charHeight + 5}`"
      stroke="#6366f1"
      stroke-width="2"
      class="pattern-indicator"
    />
  </g>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'

export default {
  name: 'StringChar',
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
    
    // 문자 크기
    const charWidth = computed(() => props.element.width || 30)
    const charHeight = computed(() => props.element.height || 35)
    const borderRadius = computed(() => 3)
    
    // 스타일
    const backgroundColor = computed(() => {
      if (props.element.state === 'matching') return '#fef3c7'
      if (props.element.state === 'matched') return '#d1fae5'
      if (props.element.state === 'mismatched') return '#fecaca'
      if (props.element.state === 'current') return '#dbeafe'
      if (props.element.state === 'pattern') return '#e0e7ff'
      if (props.selected) return '#eef2ff'
      return '#ffffff'
    })
    
    const borderColor = computed(() => {
      if (props.element.state === 'matching') return '#f59e0b'
      if (props.element.state === 'matched') return '#10b981'
      if (props.element.state === 'mismatched') return '#ef4444'
      if (props.element.state === 'current') return '#3b82f6'
      if (props.element.state === 'pattern') return '#6366f1'
      if (props.selected) return '#6366f1'
      return '#d1d5db'
    })
    
    const borderWidth = computed(() => {
      return props.selected || props.element.state !== 'default' ? 2 : 1
    })
    
    const textColor = computed(() => {
      if (props.element.state === 'matched') return '#047857'
      if (props.element.state === 'mismatched') return '#991b1b'
      return '#374151'
    })
    
    const fontSize = computed(() => '14')
    
    const fontWeight = computed(() => {
      return props.element.state !== 'default' ? '600' : '500'
    })
    
    const displayValue = computed(() => {
      const value = props.element.value
      if (value === ' ') return '␣' // 공백 시각화
      if (value === '\n') return '↵' // 개행 시각화
      if (value === '\t') return '→' // 탭 시각화
      return value ?? ''
    })
    
    const showIndex = computed(() => {
      return props.element.showIndex !== false && 
             props.element.index !== undefined
    })
    
    const stateColor = computed(() => {
      const stateColors = {
        matching: '#f59e0b',
        matched: '#10b981',
        mismatched: '#ef4444',
        current: '#3b82f6',
        pattern: '#6366f1'
      }
      return stateColors[props.element.state] || '#6b7280'
    })
    
    // 값 편집
    const handleValueSubmit = () => {
      const newValue = editValue.value
      if (newValue.length <= 1) {
        emit('value-change', newValue || ' ')
      } else {
        handleValueCancel()
      }
    }
    
    const handleValueCancel = () => {
      editValue.value = props.element.value || ''
      emit('value-change', props.element.value)
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
      editValue.value = props.element.value || ''
    }
    
    return {
      editInput,
      editValue,
      charWidth,
      charHeight,
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
      handleValueSubmit,
      handleValueCancel
    }
  }
}
</script>

<style scoped>
.string-char {
  transition: all 0.2s ease;
}

.char-background {
  transition: all 0.2s ease;
}

.char-index {
  font-family: 'Consolas', 'Monaco', monospace;
  pointer-events: none;
}

.char-value {
  font-family: 'Consolas', 'Monaco', monospace;
  pointer-events: none;
  transition: all 0.2s ease;
}

.value-editor {
  pointer-events: auto;
}

.value-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  font-weight: 500;
}

.state-indicator {
  pointer-events: none;
  animation: state-pulse 1s ease-in-out infinite alternate;
}

.pattern-indicator {
  pointer-events: none;
  opacity: 0.7;
}

@keyframes state-pulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style> 