<template>
  <footer class="control-panel" :class="{ collapsed: isCollapsed }">
    <!-- 토글 버튼 -->
    <div class="toggle-container">
      <button class="toggle-btn" @click="toggleCollapse">
        <BaseIcon :name="isCollapsed ? 'chevron-up' : 'chevron-down'" />
      </button>
    </div>
    
    <!-- 축소 상태일 때 보이는 핵심 컨트롤 -->
    <div v-if="isCollapsed" class="collapsed-controls">
      <button 
        :class="['control-btn', 'compact', { disabled: !canControl }]"
        :disabled="!canControl"
        @click="handlePlayPause"
      >
        <BaseIcon :name="isPlaying ? 'pause' : 'play'" />
      </button>
      
      <button 
        :class="['control-btn', 'compact', { disabled: !canControl }]"
        :disabled="!canControl"
        @click="handleStop"
      >
        <BaseIcon name="stop" />
      </button>
      
      <div v-if="currentStep !== null" class="step-indicator compact">
        {{ currentStep }}/{{ totalSteps }}
      </div>
      
      <div class="speed-control compact">
        <span class="speed-value compact">{{ animationSpeed }}x</span>
      </div>
    </div>
    
    <!-- 펼친 상태일 때 보이는 전체 컨트롤 -->
    <div v-else class="expanded-content">
      <div class="controls">
        <button 
          :class="['control-btn', { disabled: !canControl }]"
          :disabled="!canControl"
          @click="handlePlayPause"
        >
          <BaseIcon :name="isPlaying ? 'pause' : 'play'" />
          {{ isPlaying ? '일시정지' : '재생' }}
        </button>
        
        <button 
          :class="['control-btn', { disabled: !canControl }]"
          :disabled="!canControl"
          @click="handleStop"
        >
          <BaseIcon name="stop" />
          정지
        </button>
        
        <button 
          :class="['control-btn', { disabled: !canControl }]"
          :disabled="!canControl"
          @click="handleReset"
        >
          <BaseIcon name="reset" />
          초기화
        </button>

        <div class="step-controls">
          <button 
            :class="['step-btn', { disabled: !canControl || isPlaying }]"
            :disabled="!canControl || isPlaying"
            @click="handleStepBack"
          >
            <BaseIcon name="step-backward" />
          </button>
          <button 
            :class="['step-btn', { disabled: !canControl || isPlaying }]"
            :disabled="!canControl || isPlaying"
            @click="handleStepForward"
          >
            <BaseIcon name="step-forward" />
          </button>
        </div>
      </div>
      
      <div class="status-info">
        <div v-if="currentStep !== null" class="step-indicator">
          단계: {{ currentStep }} / {{ totalSteps }}
        </div>
        <div v-if="executionTime" class="execution-time">
          실행시간: {{ executionTime }}ms
        </div>
      </div>
      
      <div class="speed-control">
        <label for="speed">속도:</label>
        <input 
          id="speed" 
          type="range" 
          min="1" 
          max="5" 
          :value="animationSpeed"
          :disabled="!canControl"
          @input="handleSpeedChange"
        >
        <span class="speed-value">{{ animationSpeed }}x</span>
        
        <div class="preset-speeds">
          <button 
            v-for="speed in presetSpeeds" 
            :key="speed"
            :class="['speed-preset', { active: animationSpeed === speed }]"
            :disabled="!canControl"
            @click="setSpeed(speed)"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'ControlPanel',
  components: {
    BaseIcon
  },
  props: {
    isPlaying: {
      type: Boolean,
      default: false
    },
    animationSpeed: {
      type: Number,
      default: 3
    },
    canControl: {
      type: Boolean,
      default: false
    },
    currentStep: {
      type: Number,
      default: null
    },
    totalSteps: {
      type: Number,
      default: 0
    },
    executionTime: {
      type: Number,
      default: null
    }
  },
  emits: [
    'play-pause',
    'stop',
    'reset',
    'speed-change',
    'step-forward',
    'step-back'
  ],
  setup(props, { emit }) {
    const presetSpeeds = [0.5, 1, 2, 3, 5]
    const isCollapsed = ref(false)

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const handlePlayPause = () => {
      emit('play-pause')
    }

    const handleStop = () => {
      emit('stop')
    }

    const handleReset = () => {
      emit('reset')
    }

    const handleSpeedChange = (event) => {
      const speed = parseFloat(event.target.value)
      emit('speed-change', speed)
    }

    const setSpeed = (speed) => {
      emit('speed-change', speed)
    }

    const handleStepForward = () => {
      emit('step-forward')
    }

    const handleStepBack = () => {
      emit('step-back')
    }

    return {
      presetSpeeds,
      isCollapsed,
      toggleCollapse,
      handlePlayPause,
      handleStop,
      handleReset,
      handleSpeedChange,
      setSpeed,
      handleStepForward,
      handleStepBack
    }
  }
}
</script>

<style scoped>
.control-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease-in-out;
  z-index: 100;
}

.control-panel.collapsed {
  transform: translateY(calc(100% - 60px));
}

.toggle-container {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
}

.toggle-btn {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px 20px 0 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  font-size: 1.2rem;
  color: #6366f1;
}

.toggle-btn:hover {
  background: #f8fafc;
  border-color: #6366f1;
  transform: translateX(-50%) translateY(-2px);
}

.collapsed-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  min-height: 60px;
}

.expanded-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 2rem;
  min-height: 80px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 600;
  min-height: 48px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.control-btn.compact {
  padding: 0.75rem;
  min-width: 44px;
  min-height: 44px;
  gap: 0;
  border-radius: 8px;
}

.control-btn:not(.disabled):hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.control-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.step-controls {
  display: flex;
  gap: 0.75rem;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
  border-left: 2px solid #e2e8f0;
}

.step-btn {
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.step-btn:not(.disabled):hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.15);
}

.step-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.status-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

.step-indicator,
.execution-time {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.step-indicator.compact {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #6366f1;
  font-weight: 700;
}

.execution-time {
  color: #059669;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: flex-end;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.speed-control.compact {
  padding: 0;
  background: transparent;
  border: none;
  gap: 0;
  flex: none;
}

.speed-control label {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

.speed-control input {
  width: 150px;
  height: 10px;
  border-radius: 5px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.speed-control input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.speed-control input::-webkit-slider-thumb:hover {
  background: #4f46e5;
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.speed-value {
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.speed-value.compact {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  min-width: 35px;
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #6366f1;
  font-weight: 700;
}

.preset-speeds {
  display: flex;
  gap: 0.5rem;
}

.speed-preset {
  padding: 0.5rem 0.75rem;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speed-preset:hover:not(:disabled) {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-1px);
}

.speed-preset.active {
  border-color: #6366f1;
  background: #eef2ff;
  color: #6366f1;
  font-weight: 700;
}

.speed-preset:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .expanded-content {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    min-height: auto;
  }
  
  .controls,
  .status-info,
  .speed-control {
    flex: none;
    width: 100%;
  }
  
  .speed-control {
    justify-content: center;
  }
  
  .preset-speeds {
    flex-wrap: wrap;
  }
  
  .collapsed-controls {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }
  
  .control-panel.collapsed {
    transform: translateY(calc(100% - 50px));
  }
  
  .toggle-btn {
    top: -35px;
    min-width: 50px;
    padding: 0.25rem 0.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .expanded-content {
    padding: 1rem;
    gap: 1rem;
  }
  
  .controls {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .step-controls {
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    border-top: 2px solid #e2e8f0;
    padding-top: 1rem;
    width: 100%;
    justify-content: center;
  }
  
  .control-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
  
  .control-btn.compact {
    min-width: 40px;
    min-height: 40px;
  }
  
  .step-btn {
    min-width: 44px;
    min-height: 44px;
  }
  
  .status-info {
    order: -1;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
  
  .speed-control {
    padding: 1rem;
    gap: 1rem;
  }
  
  .speed-control input {
    width: 120px;
  }
  
  .preset-speeds {
    gap: 0.25rem;
  }
  
  .speed-preset {
    padding: 0.5rem;
    min-width: 36px;
    min-height: 36px;
    font-size: 0.8rem;
  }
  
  .collapsed-controls {
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }
  
  .control-panel.collapsed {
    transform: translateY(calc(100% - 45px));
  }
  
  .toggle-btn {
    top: -30px;
    min-width: 45px;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style> 