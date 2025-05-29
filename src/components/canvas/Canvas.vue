<template>
  <div class="canvas-wrapper" ref="canvasWrapper">
    <div class="canvas-container" ref="canvasContainer">
      <svg
        class="canvas-svg"
        :width="canvasSize.width"
        :height="canvasSize.height"
        :viewBox="viewBox"
        ref="canvasSvg"
        @wheel="handleWheel"
        @mousedown="handlePanStart"
        @mousemove="handlePanMove"
        @mouseup="handlePanEnd"
        @mouseleave="handlePanEnd"
      >
        <!-- 그리드 배경 -->
        <defs>
          <pattern 
            id="grid" 
            :width="gridSize" 
            :height="gridSize" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`" 
              fill="none" 
              stroke="#e2e8f0" 
              stroke-width="1"
              opacity="0.5"
            />
          </pattern>
          
          <!-- 화살표 마커 -->
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
        </defs>
        
        <!-- 그리드 표시 -->
        <rect 
          v-if="showGrid"
          width="100%" 
          height="100%" 
          fill="url(#grid)"
        />
        
        <!-- 캔버스 요소들을 렌더링할 영역 -->
        <g>
          <!-- 연결선들 -->
          <g class="connections-layer">
            <CanvasConnection
              v-for="connection in connections"
              :key="connection.id"
              :connection="connection"
              @connection-select="$emit('connection-select', $event)"
              @connection-delete="$emit('connection-delete', $event)"
            />
          </g>
          
          <!-- 요소들 -->
          <g class="elements-layer">
            <CanvasElement
              v-for="element in elements"
              :key="element.id"
              :element="element"
              :selected="selectedElements.includes(element.id)"
              :snap-to-grid="snapToGrid"
              :grid-size="gridSize"
              @element-move="handleElementMove"
              @element-select="handleElementSelect"
              @element-delete="handleElementDelete"
              @element-duplicate="handleElementDuplicate"
              @element-connect="handleElementConnect"
            />
          </g>
          
          <!-- 선택 영역 -->
          <rect
            v-if="selectionArea"
            :x="selectionArea.x"
            :y="selectionArea.y"
            :width="selectionArea.width"
            :height="selectionArea.height"
            fill="rgba(99, 102, 241, 0.1)"
            stroke="rgb(99, 102, 241)"
            stroke-width="1"
            stroke-dasharray="5,5"
          />
        </g>
      </svg>
      
      <!-- 캔버스 컨트롤 -->
      <div class="canvas-controls">
        <div class="zoom-controls">
          <BaseButton 
            size="small" 
            variant="outline" 
            icon="➕"
            @click="zoomIn"
            :disabled="zoom >= maxZoom"
          />
          <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
          <BaseButton 
            size="small" 
            variant="outline" 
            icon="➖"
            @click="zoomOut"
            :disabled="zoom <= minZoom"
          />
          <BaseButton 
            size="small" 
            variant="outline" 
            @click="resetZoom"
          >
            리셋
          </BaseButton>
        </div>
        
        <div class="canvas-options">
          <label class="option-item">
            <input 
              type="checkbox" 
              v-model="showGrid"
              @change="$emit('grid-toggle', showGrid)"
            />
            그리드 표시
          </label>
          <label class="option-item">
            <input 
              type="checkbox" 
              v-model="snapToGrid"
              @change="$emit('snap-toggle', snapToGrid)"
            />
            그리드 스냅
          </label>
        </div>
      </div>
      
      <!-- 미니맵 (선택사항) -->
      <div v-if="showMinimap" class="minimap">
        <svg 
          :width="minimapSize.width" 
          :height="minimapSize.height"
          :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`"
        >
          <rect 
            width="100%" 
            height="100%" 
            fill="#f8fafc" 
            stroke="#e2e8f0"
          />
          <g v-for="element in elements" :key="element.id">
            <rect
              :x="element.x"
              :y="element.y"
              :width="element.width || 50"
              :height="element.height || 30"
              fill="#6366f1"
              opacity="0.7"
            />
          </g>
          <rect
            :x="(-pan.x / zoom)"
            :y="(-pan.y / zoom)"
            :width="canvasSize.width / zoom"
            :height="canvasSize.height / zoom"
            fill="none"
            stroke="#ef4444"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '@/stores'
import BaseButton from '@/components/common/BaseButton.vue'
import CanvasElement from './CanvasElement.vue'
import CanvasConnection from './CanvasConnection.vue'

export default {
  name: 'Canvas',
  components: {
    BaseButton,
    CanvasElement,
    CanvasConnection
  },
  props: {
    elements: {
      type: Array,
      default: () => []
    },
    connections: {
      type: Array,
      default: () => []
    },
    selectedElements: {
      type: Array,
      default: () => []
    },
    showMinimap: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'element-move',
    'element-select',
    'element-delete',
    'element-duplicate',
    'element-connect',
    'connection-select',
    'connection-delete',
    'canvas-click',
    'grid-toggle',
    'snap-toggle'
  ],
  setup(props, { emit }) {
    const appStore = useAppStore()
    
    // 참조들
    const canvasWrapper = ref(null)
    const canvasContainer = ref(null)
    const canvasSvg = ref(null)
    
    // 캔버스 상태
    const canvasSize = ref({ width: 1200, height: 800 })
    const zoom = ref(1)
    const minZoom = ref(0.5)
    const maxZoom = ref(2)
    const pan = ref({ x: 0, y: 0 })
    const gridSize = ref(20)
    const showGrid = ref(true)
    const snapToGrid = ref(true)
    
    // 팬 상태
    const isPanning = ref(false)
    const lastPanPoint = ref({ x: 0, y: 0 })
    
    // 선택 영역
    const selectionArea = ref(null)
    const isSelecting = ref(false)
    
    // 계산된 속성들
    const viewBox = computed(() => {
      return `0 0 ${canvasSize.value.width} ${canvasSize.value.height}`
    })
    
    const transformString = computed(() => {
      return '' // transform 제거
    })
    
    const minimapSize = computed(() => ({
      width: 200,
      height: 150
    }))
    
    // 줌 기능
    const zoomIn = () => {
      if (zoom.value < maxZoom.value) {
        const newZoom = Math.min(zoom.value * 1.2, maxZoom.value)
        zoom.value = newZoom
      }
    }
    
    const zoomOut = () => {
      if (zoom.value > minZoom.value) {
        const newZoom = Math.max(zoom.value / 1.2, minZoom.value)
        zoom.value = newZoom
      }
    }
    
    const resetZoom = () => {
      zoom.value = 1
      pan.value = { x: 0, y: 0 }
    }
    
    // 휠 줌
    const handleWheel = (event) => {
      event.preventDefault()
      
      const rect = canvasSvg.value.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const delta = event.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(minZoom.value, Math.min(maxZoom.value, zoom.value * delta))
      
      if (newZoom !== zoom.value) {
        zoom.value = newZoom
      }
    }
    
    // 팬 기능
    const handlePanStart = (event) => {
      if (event.button === 1 || event.ctrlKey) { // 중간 버튼 또는 Ctrl+클릭
        isPanning.value = true
        lastPanPoint.value = { x: event.clientX, y: event.clientY }
        event.preventDefault()
      }
    }
    
    const handlePanMove = (event) => {
      if (isPanning.value) {
        const deltaX = event.clientX - lastPanPoint.value.x
        const deltaY = event.clientY - lastPanPoint.value.y
        
        pan.value.x += deltaX
        pan.value.y += deltaY
        
        lastPanPoint.value = { x: event.clientX, y: event.clientY }
        event.preventDefault()
      }
    }
    
    const handlePanEnd = () => {
      isPanning.value = false
    }
    
    // 요소 이벤트 핸들러들
    const handleElementMove = (elementId, newPosition) => {
      emit('element-move', elementId, newPosition)
    }
    
    const handleElementSelect = (elementId, multiSelect = false) => {
      emit('element-select', elementId, multiSelect)
    }
    
    const handleElementDelete = (elementId) => {
      emit('element-delete', elementId)
    }
    
    const handleElementDuplicate = (elementId) => {
      emit('element-duplicate', elementId)
    }
    
    const handleElementConnect = (fromElementId, toElementId) => {
      emit('element-connect', fromElementId, toElementId)
    }
    
    // 그리드 스냅 기능
    const snapToGridFunction = (value) => {
      if (!snapToGrid.value) return value
      return Math.round(value / gridSize.value) * gridSize.value
    }
    
    // 리사이즈 핸들러
    const handleResize = () => {
      nextTick(() => {
        if (canvasWrapper.value) {
          const rect = canvasWrapper.value.getBoundingClientRect()
          canvasSize.value = {
            width: Math.max(rect.width, 800),
            height: Math.max(rect.height, 600)
          }
        }
      })
    }
    
    // 키보드 단축키
    const handleKeydown = (event) => {
      if (event.target.tagName === 'INPUT') return
      
      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          if (props.selectedElements.length > 0) {
            props.selectedElements.forEach(elementId => {
              emit('element-delete', elementId)
            })
          }
          break
        case '=':
        case '+':
          if (event.ctrlKey) {
            event.preventDefault()
            zoomIn()
          }
          break
        case '-':
          if (event.ctrlKey) {
            event.preventDefault()
            zoomOut()
          }
          break
        case '0':
          if (event.ctrlKey) {
            event.preventDefault()
            resetZoom()
          }
          break
      }
    }
    
    // 라이프사이클
    onMounted(() => {
      handleResize()
      window.addEventListener('resize', handleResize)
      window.addEventListener('keydown', handleKeydown)
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeydown)
    })
    
    return {
      // 참조들
      canvasWrapper,
      canvasContainer,
      canvasSvg,
      
      // 상태들
      canvasSize,
      zoom,
      minZoom,
      maxZoom,
      pan,
      gridSize,
      showGrid,
      snapToGrid,
      selectionArea,
      
      // 계산된 속성들
      viewBox,
      transformString,
      minimapSize,
      
      // 메서드들
      zoomIn,
      zoomOut,
      resetZoom,
      handleWheel,
      handlePanStart,
      handlePanMove,
      handlePanEnd,
      handleElementMove,
      handleElementSelect,
      handleElementDelete,
      handleElementDuplicate,
      handleElementConnect,
      snapToGridFunction
    }
  }
}
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.canvas-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
}

.canvas-svg:active {
  cursor: grabbing;
}

.connections-layer {
  pointer-events: none;
}

.connections-layer > * {
  pointer-events: auto;
}

.elements-layer {
  pointer-events: none;
}

.elements-layer > * {
  pointer-events: auto;
}

.canvas-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-level {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 50px;
  text-align: center;
}

.canvas-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.option-item input[type="checkbox"] {
  margin: 0;
}

.minimap {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.minimap svg {
  display: block;
}

@media (max-width: 768px) {
  .canvas-controls {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
  }
  
  .zoom-controls {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .minimap {
    display: none;
  }
}
</style> 