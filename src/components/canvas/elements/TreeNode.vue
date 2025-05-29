<template>
  <g class="tree-node">
    <!-- 트리 노드 배경 -->
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
        type="number"
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
    
    <!-- 레벨 표시 -->
    <text
      v-if="element.level !== undefined"
      :x="-5"
      :y="5"
      font-size="10"
      fill="#6b7280"
      class="node-level"
    >
      L{{ element.level }}
    </text>
    
    <!-- 높이/균형인수 표시 -->
    <text
      v-if="element.height !== undefined"
      :x="nodeRadius * 2 + 5"
      :y="nodeRadius"
      font-size="10"
      fill="#374151"
      class="node-height"
    >
      h:{{ element.height }}
    </text>
    
    <!-- 순회 순서 표시 -->
    <text
      v-if="element.traversalOrder !== undefined"
      :x="nodeRadius"
      :y="nodeRadius * 2 + 15"
      text-anchor="middle"
      font-size="10"
      :fill="traversalColor"
      class="traversal-order"
    >
      {{ element.traversalOrder }}
    </text>
  </g>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'

export default {
  name: 'TreeNode',
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
      if (props.element.state === 'searching') return '#fef3c7'
      if (props.element.state === 'found') return '#d1fae5'
      if (props.element.state === 'inserting') return '#dbeafe'
      if (props.element.state === 'deleting') return '#fecaca'
      if (props.element.state === 'traversing') return '#e0e7ff'
      if (props.selected) return '#eef2ff'
      return '#ffffff'
    })
    
    const borderColor = computed(() => {
      if (props.element.state === 'searching') return '#f59e0b'
      if (props.element.state === 'found') return '#10b981'
      if (props.element.state === 'inserting') return '#3b82f6'
      if (props.element.state === 'deleting') return '#ef4444'
      if (props.element.state === 'traversing') return '#6366f1'
      if (props.selected) return '#6366f1'
      return '#d1d5db'
    })
    
    const borderWidth = computed(() => {
      return props.selected || props.element.state !== 'default' ? 3 : 2
    })
    
    const textColor = computed(() => {
      if (props.element.state === 'found') return '#047857'
      if (props.element.state === 'deleting') return '#991b1b'
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
    
    const traversalColor = computed(() => {
      const colors = {
        preorder: '#ef4444',
        inorder: '#3b82f6',
        postorder: '#10b981',
        levelorder: '#f59e0b'
      }
      return colors[props.element.traversalType] || '#6b7280'
    })
    
    // 값 편집
    const handleValueSubmit = () => {
      const newValue = parseInt(editValue.value)
      if (!isNaN(newValue)) {
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
      traversalColor,
      handleValueSubmit,
      handleValueCancel
    }
  }
}
</script>

<style scoped>
.tree-node {
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

.node-level,
.node-height,
.traversal-order {
  font-weight: 500;
  pointer-events: none;
}

.traversal-order {
  font-weight: 600;
}
</style> 