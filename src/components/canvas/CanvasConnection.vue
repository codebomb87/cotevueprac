<template>
  <g 
    :class="connectionClasses"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 연결선 배경 (클릭 영역 확대용) -->
    <path
      :d="pathData"
      :stroke="backgroundColor"
      :stroke-width="strokeWidth + 8"
      fill="none"
      opacity="0"
      class="connection-background"
    />
    
    <!-- 실제 연결선 -->
    <path
      :d="pathData"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :stroke-dasharray="strokeDasharray"
      :marker-end="hasArrow ? 'url(#arrowhead)' : ''"
      fill="none"
      class="connection-line"
    />
    
    <!-- 가중치 라벨 -->
    <g v-if="connection.weight !== undefined" class="weight-label">
      <circle
        :cx="labelPosition.x"
        :cy="labelPosition.y"
        :r="labelRadius"
        fill="white"
        stroke="#d1d5db"
        stroke-width="1"
      />
      <text
        :x="labelPosition.x"
        :y="labelPosition.y"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="12"
        font-weight="500"
        fill="#374151"
      >
        {{ connection.weight }}
      </text>
    </g>
    
    <!-- 연결선 라벨 -->
    <text
      v-if="connection.label"
      :x="labelPosition.x"
      :y="labelPosition.y - 15"
      text-anchor="middle"
      font-size="11"
      fill="#6b7280"
      class="connection-label"
    >
      {{ connection.label }}
    </text>
    
    <!-- 선택 표시 -->
    <path
      v-if="selected"
      :d="pathData"
      stroke="#6366f1"
      :stroke-width="strokeWidth + 4"
      stroke-dasharray="8,4"
      fill="none"
      opacity="0.7"
      class="selection-indicator"
    />
  </g>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'CanvasConnection',
  props: {
    connection: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'connection-select',
    'connection-delete'
  ],
  setup(props, { emit }) {
    // 연결 상태에 따른 스타일
    const connectionClasses = computed(() => [
      'canvas-connection',
      `canvas-connection--${props.connection.type || 'default'}`,
      {
        'canvas-connection--selected': props.selected,
        'canvas-connection--animated': props.connection.animated,
        'canvas-connection--highlighted': props.connection.highlighted
      }
    ])
    
    const strokeColor = computed(() => {
      if (props.connection.highlighted) return '#f59e0b'
      if (props.connection.type === 'error') return '#ef4444'
      if (props.connection.type === 'success') return '#10b981'
      return props.connection.color || '#6b7280'
    })
    
    const strokeWidth = computed(() => {
      return props.connection.width || 2
    })
    
    const strokeDasharray = computed(() => {
      if (props.connection.style === 'dashed') return '5,5'
      if (props.connection.style === 'dotted') return '2,2'
      return 'none'
    })
    
    const backgroundColor = computed(() => {
      return '#transparent'
    })
    
    const hasArrow = computed(() => {
      return props.connection.arrow !== false
    })
    
    // 경로 계산
    const pathData = computed(() => {
      const { from, to } = props.connection
      
      // 직선 연결
      if (props.connection.style === 'straight') {
        return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
      }
      
      // 곡선 연결 (베지어 곡선)
      if (props.connection.style === 'curved') {
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        const controlOffset = 50
        
        return `M ${from.x} ${from.y} Q ${midX} ${midY - controlOffset} ${to.x} ${to.y}`
      }
      
      // 직각 연결 (기본값)
      const deltaX = to.x - from.x
      const deltaY = to.y - from.y
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 수평 우선
        const midX = from.x + deltaX / 2
        return `M ${from.x} ${from.y} H ${midX} V ${to.y} H ${to.x}`
      } else {
        // 수직 우선
        const midY = from.y + deltaY / 2
        return `M ${from.x} ${from.y} V ${midY} H ${to.x} V ${to.y}`
      }
    })
    
    // 라벨 위치 계산
    const labelPosition = computed(() => {
      const { from, to } = props.connection
      return {
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2
      }
    })
    
    const labelRadius = computed(() => {
      const weightStr = String(props.connection.weight || '')
      return Math.max(12, weightStr.length * 4 + 8)
    })
    
    // 이벤트 핸들러
    const handleClick = (event) => {
      emit('connection-select', props.connection.id)
      event.stopPropagation()
    }
    
    const handleMouseEnter = () => {
      // 호버 효과
    }
    
    const handleMouseLeave = () => {
      // 호버 효과 제거
    }
    
    return {
      connectionClasses,
      strokeColor,
      strokeWidth,
      strokeDasharray,
      backgroundColor,
      hasArrow,
      pathData,
      labelPosition,
      labelRadius,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    }
  }
}
</script>

<style scoped>
.canvas-connection {
  cursor: pointer;
}

.connection-background {
  cursor: pointer;
}

.connection-line {
  transition: all 0.2s;
  pointer-events: none;
}

.canvas-connection:hover .connection-line {
  stroke-width: 3;
  opacity: 0.8;
}

.canvas-connection--selected .connection-line {
  stroke-width: 3;
}

.canvas-connection--animated .connection-line {
  stroke-dasharray: 10,5;
  animation: connection-flow 2s linear infinite;
}

.canvas-connection--highlighted .connection-line {
  filter: drop-shadow(0 0 4px currentColor);
}

.weight-label {
  pointer-events: none;
}

.connection-label {
  pointer-events: none;
  font-family: system-ui, -apple-system, sans-serif;
}

.selection-indicator {
  pointer-events: none;
  animation: selection-pulse 1.5s ease-in-out infinite;
}

@keyframes connection-flow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 15;
  }
}

@keyframes selection-pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
}
</style> 