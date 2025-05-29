<template>
  <g 
    ref="elementRef"
    :class="elementClasses"
    :transform="`translate(${element.x}, ${element.y})`"
    @mousedown="handleMouseDown"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @contextmenu="handleContextMenu"
  >
    <!-- 선택 표시 -->
    <rect
      v-if="selected"
      :x="-5"
      :y="-5"
      :width="(element.width || 80) + 10"
      :height="(element.height || 50) + 10"
      fill="none"
      stroke="#6366f1"
      stroke-width="2"
      stroke-dasharray="5,5"
      opacity="0.7"
    />
    
    <!-- 요소 타입별 렌더링 -->
    <component 
      :is="elementComponent" 
      :element="element"
      :selected="selected"
      :editing="editing"
      @value-change="handleValueChange"
    />
    
    <!-- 연결점들 -->
    <g v-if="showConnectionPoints" class="connection-points">
      <circle
        v-for="point in connectionPoints"
        :key="point.id"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="#6366f1"
        stroke="white"
        stroke-width="2"
        class="connection-point"
        @mousedown.stop="handleConnectionStart(point)"
      />
    </g>
    
    <!-- 리사이즈 핸들 -->
    <g v-if="selected && resizable" class="resize-handles">
      <rect
        v-for="handle in resizeHandles"
        :key="handle.position"
        :x="handle.x - 4"
        :y="handle.y - 4"
        width="8"
        height="8"
        fill="#6366f1"
        stroke="white"
        stroke-width="1"
        class="resize-handle"
        :data-position="handle.position"
        @mousedown.stop="handleResizeStart($event, handle.position)"
      />
    </g>
  </g>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import interact from 'interactjs'

// 요소 타입별 컴포넌트들
import ArrayElement from './elements/ArrayElement.vue'
import GraphNode from './elements/GraphNode.vue'
import TreeNode from './elements/TreeNode.vue'
import StringChar from './elements/StringChar.vue'

export default {
  name: 'CanvasElement',
  components: {
    ArrayElement,
    GraphNode,
    TreeNode,
    StringChar
  },
  props: {
    element: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    snapToGrid: {
      type: Boolean,
      default: true
    },
    gridSize: {
      type: Number,
      default: 20
    }
  },
  emits: [
    'element-move',
    'element-select',
    'element-delete',
    'element-duplicate',
    'element-connect',
    'value-change',
    'resize'
  ],
  setup(props, { emit }) {
    const elementRef = ref(null)
    const editing = ref(false)
    const isDragging = ref(false)
    const isResizing = ref(false)
    const showConnectionPoints = ref(false)
    
    // 요소 타입별 컴포넌트 매핑
    const elementComponent = computed(() => {
      const typeMap = {
        'array-element': 'ArrayElement',
        'graph-node': 'GraphNode',
        'tree-node': 'TreeNode',
        'string-char': 'StringChar'
      }
      return typeMap[props.element.type] || 'ArrayElement'
    })
    
    const elementClasses = computed(() => [
      'canvas-element',
      `canvas-element--${props.element.type}`,
      {
        'canvas-element--selected': props.selected,
        'canvas-element--dragging': isDragging.value,
        'canvas-element--editing': editing.value
      }
    ])
    
    const resizable = computed(() => {
      return props.element.resizable !== false
    })
    
    // 연결점 계산
    const connectionPoints = computed(() => {
      const width = props.element.width || 80
      const height = props.element.height || 50
      
      return [
        { id: 'top', x: width / 2, y: 0 },
        { id: 'right', x: width, y: height / 2 },
        { id: 'bottom', x: width / 2, y: height },
        { id: 'left', x: 0, y: height / 2 }
      ]
    })
    
    // 리사이즈 핸들 계산
    const resizeHandles = computed(() => {
      if (!resizable.value) return []
      
      const width = props.element.width || 80
      const height = props.element.height || 50
      
      return [
        { position: 'nw', x: 0, y: 0 },
        { position: 'ne', x: width, y: 0 },
        { position: 'sw', x: 0, y: height },
        { position: 'se', x: width, y: height },
        { position: 'n', x: width / 2, y: 0 },
        { position: 's', x: width / 2, y: height },
        { position: 'e', x: width, y: height / 2 },
        { position: 'w', x: 0, y: height / 2 }
      ]
    })
    
    // 그리드 스냅
    const snapToGridValue = (value) => {
      if (!props.snapToGrid) return value
      return Math.round(value / props.gridSize) * props.gridSize
    }
    
    // 이벤트 핸들러들
    const handleClick = (event) => {
      if (!isDragging.value) {
        const multiSelect = event.ctrlKey || event.metaKey
        emit('element-select', props.element.id, multiSelect)
      }
      event.stopPropagation()
    }
    
    const handleDoubleClick = (event) => {
      editing.value = true
      event.stopPropagation()
    }
    
    const handleMouseDown = (event) => {
      if (event.button === 0) { // 좌클릭만
        event.stopPropagation()
      }
    }
    
    const handleContextMenu = (event) => {
      event.preventDefault()
      // 컨텍스트 메뉴 표시 로직
      console.log('Context menu for element:', props.element.id)
    }
    
    const handleValueChange = (newValue) => {
      emit('value-change', props.element.id, newValue)
      editing.value = false
    }
    
    const handleConnectionStart = (point) => {
      console.log('Connection started from:', props.element.id, point.id)
      // 연결 시작 로직
    }
    
    const handleResizeStart = (event, position) => {
      isResizing.value = true
      console.log('Resize started:', position)
      event.stopPropagation()
    }
    
    // interact.js 설정
    const setupInteraction = () => {
      if (!elementRef.value) return
      
      interact(elementRef.value)
        .draggable({
          listeners: {
            start(event) {
              isDragging.value = true
              showConnectionPoints.value = true
            },
            move(event) {
              const newX = snapToGridValue(props.element.x + event.dx)
              const newY = snapToGridValue(props.element.y + event.dy)
              
              emit('element-move', props.element.id, { x: newX, y: newY })
            },
            end(event) {
              isDragging.value = false
              showConnectionPoints.value = false
            }
          }
        })
        .on('tap', (event) => {
          if (event.detail === 2) { // Double tap
            handleDoubleClick(event)
          }
        })
    }
    
    // 키보드 이벤트
    const handleKeyDown = (event) => {
      if (!props.selected) return
      
      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          emit('element-delete', props.element.id)
          break
        case 'Escape':
          editing.value = false
          break
        case 'Enter':
          if (event.ctrlKey) {
            emit('element-duplicate', props.element.id)
          } else if (editing.value) {
            editing.value = false
          } else {
            editing.value = true
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          emit('element-move', props.element.id, {
            x: props.element.x,
            y: snapToGridValue(props.element.y - props.gridSize)
          })
          break
        case 'ArrowDown':
          event.preventDefault()
          emit('element-move', props.element.id, {
            x: props.element.x,
            y: snapToGridValue(props.element.y + props.gridSize)
          })
          break
        case 'ArrowLeft':
          event.preventDefault()
          emit('element-move', props.element.id, {
            x: snapToGridValue(props.element.x - props.gridSize),
            y: props.element.y
          })
          break
        case 'ArrowRight':
          event.preventDefault()
          emit('element-move', props.element.id, {
            x: snapToGridValue(props.element.x + props.gridSize),
            y: props.element.y
          })
          break
      }
    }
    
    onMounted(() => {
      setupInteraction()
      window.addEventListener('keydown', handleKeyDown)
    })
    
    onUnmounted(() => {
      if (elementRef.value) {
        interact(elementRef.value).unset()
      }
      window.removeEventListener('keydown', handleKeyDown)
    })
    
    return {
      elementRef,
      editing,
      isDragging,
      isResizing,
      showConnectionPoints,
      elementComponent,
      elementClasses,
      resizable,
      connectionPoints,
      resizeHandles,
      handleClick,
      handleDoubleClick,
      handleMouseDown,
      handleContextMenu,
      handleValueChange,
      handleConnectionStart,
      handleResizeStart
    }
  }
}
</script>

<style scoped>
.canvas-element {
  cursor: pointer;
  user-select: none;
}

.canvas-element--dragging {
  cursor: grabbing;
}

.canvas-element--selected {
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
}

.connection-points {
  opacity: 0;
  transition: opacity 0.2s;
}

.canvas-element:hover .connection-points,
.canvas-element--selected .connection-points {
  opacity: 1;
}

.connection-point {
  cursor: crosshair;
  transition: all 0.2s;
}

.connection-point:hover {
  r: 6;
  fill: #4f46e5;
}

.resize-handles {
  opacity: 0;
  transition: opacity 0.2s;
}

.canvas-element--selected .resize-handles {
  opacity: 1;
}

.resize-handle {
  cursor: nw-resize;
  transition: all 0.2s;
}

.resize-handle:hover {
  fill: #4f46e5;
  transform: scale(1.2);
}

.resize-handle[data-position="n"],
.resize-handle[data-position="s"] {
  cursor: ns-resize;
}

.resize-handle[data-position="e"],
.resize-handle[data-position="w"] {
  cursor: ew-resize;
}

.resize-handle[data-position="ne"],
.resize-handle[data-position="sw"] {
  cursor: nesw-resize;
}

.resize-handle[data-position="nw"],
.resize-handle[data-position="se"] {
  cursor: nw-resize;
}
</style> 