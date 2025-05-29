<template>
  <g class="graph-node">
    <!-- 노드 배경 -->
    <circle
      :cx="nodeRadius"
      :cy="nodeRadius"
      :r="nodeRadius"
      :fill="backgroundColor"
      :stroke="borderColor"
      :stroke-width="borderWidth"
      class="node-background"
    />
    
    <!-- 값 표시/편집 -->
    <foreignObject
      v-if="editing"
      :x="4"
      :y="nodeRadius - 10"
      :width="nodeRadius * 2 - 8"
      :height="20"
      class="value-editor"
    >
      <input
        ref="editInput"
        v-model="editValue"
        type="text"
        @blur="handleValueSubmit"
        @keydown.enter="handleValueSubmit"
        @keydown.escape="handleValueCancel"
        class="value-input"
      />
    </foreignObject>
    
    <text
      v-else
      :x="nodeRadius"
      :y="nodeRadius"
      text-anchor="middle"
      dominant-baseline="central"
      :font-size="fontSize"
      :font-weight="fontWeight"
      :fill="textColor"
      class="node-value"
    >
      {{ displayValue }}
    </text>
    
    <!-- 방문 순서 표시 -->
    <text
      v-if="element.visitOrder !== undefined"
      :x="nodeRadius * 2 + 5"
      :y="5"
      font-size="10"
      fill="#6b7280"
      class="visit-order"
    >
      {{ element.visitOrder }}
    </text>
    
    <!-- 거리/가중치 표시 -->
    <text
      v-if="element.distance !== undefined"
      :x="nodeRadius"
      :y="nodeRadius * 2 + 15"
      text-anchor="middle"
      font-size="10"
      fill="#374151"
      class="node-distance"
    >
      d: {{ element.distance }}
    </text>
  </g>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'

export default {
  name: 'GraphNode',
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
    
    // 노드 크기
    const nodeRadius = computed(() => props.element.radius || 25)
    
    // 스타일
    const backgroundColor = computed(() => {
      if (props.element.state === 'visiting') return '#fef3c7'
      if (props.element.state === 'visited') return '#d1fae5'
      if (props.element.state === 'current') return '#dbeafe'
      if (props.element.state === 'start') return '#dcfce7'
      if (props.element.state === 'end') return '#fecaca'
      if (props.selected) return '#eef2ff'
      return '#ffffff'
    })
    
    const borderColor = computed(() => {
      if (props.element.state === 'visiting') return '#f59e0b'
      if (props.element.state === 'visited') return '#10b981'
      if (props.element.state === 'current') return '#3b82f6'
      if (props.element.state === 'start') return '#16a34a'
      if (props.element.state === 'end') return '#ef4444'
      if (props.selected) return '#6366f1'
      return '#d1d5db'
    })
    
    const borderWidth = computed(() => {
      return props.selected || props.element.state !== 'default' ? 3 : 2
    })
    
    const textColor = computed(() => {
      if (props.element.state === 'visited') return '#047857'
      return '#374151'
    })
    
    const fontSize = computed(() => {
      const value = String(props.element.value || '')
      if (value.length > 2) return '12'
      return '14'
    })
    
    const fontWeight = computed(() => {
      return props.element.state !== 'default' ? '600' : '500'
    })
    
    const displayValue = computed(() => {
      return props.element.value ?? ''
    })
    
    // 값 편집
    const handleValueSubmit = () => {
      const newValue = editValue.value.trim()
      if (newValue) {
        emit('value-change', newValue)
      } else {
        handleValueCancel()
      }
    }
    
    const handleValueCancel = () => {
      editValue.value = String(props.element.value || '')
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
      editValue.value = String(props.element.value || '')
    }
    
    return {
      editInput,
      editValue,
      nodeRadius,
      backgroundColor,
      borderColor,
      borderWidth,
      textColor,
      fontSize,
      fontWeight,
      displayValue,
      handleValueSubmit,
      handleValueCancel
    }
  }
}
</script>

<style scoped>
.graph-node {
  transition: all 0.2s ease;
}

.node-background {
  transition: all 0.2s ease;
}

.node-value {
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
  font-size: 12px;
  font-weight: 500;
}

.visit-order {
  font-weight: 600;
  pointer-events: none;
}

.node-distance {
  font-weight: 500;
  pointer-events: none;
}
</style> 