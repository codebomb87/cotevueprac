<template>
  <div class="main-layout">
    <!-- 상단 네비게이션 -->
    <NavBar 
      :current-category="currentCategory"
      :current-category-info="currentCategoryInfo"
      :status="appStore.currentStatus"
      @settings-toggle="appStore.toggleSettings"
    />

    <div class="layout-content">
      <!-- 좌측 사이드바 -->
      <Sidebar 
        :current-category="currentCategory"
        :categories="appStore.categories"
        @category-change="handleCategoryChange"
        @tool-select="handleToolSelect"
      />

      <!-- 메인 콘텐츠 영역 -->
      <main class="main-content">
        <slot name="content">
          <div class="default-content">
            <div class="content-placeholder">
              <div class="placeholder-icon">🎨</div>
              <h3>콘텐츠 영역</h3>
              <p>이곳에 메인 콘텐츠가 표시됩니다.</p>
            </div>
          </div>
        </slot>
      </main>
    </div>

    <!-- 하단 컨트롤 패널 -->
    <ControlPanel 
      :is-playing="appStore.isAnimating && !appStore.isPaused"
      :animation-speed="appStore.animationSpeed"
      :can-control="appStore.canControl"
      :current-step="appStore.algorithmState.currentStep"
      :total-steps="appStore.algorithmState.totalSteps"
      :execution-time="appStore.algorithmState.executionTime"
      @play-pause="handlePlayPause"
      @stop="handleStop"
      @reset="handleReset"
      @speed-change="handleSpeedChange"
      @step-forward="appStore.nextStep"
      @step-back="appStore.previousStep"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import NavBar from './NavBar.vue'
import Sidebar from './Sidebar.vue'
import ControlPanel from './ControlPanel.vue'

export default {
  name: 'MainLayout',
  components: {
    NavBar,
    Sidebar,
    ControlPanel
  },
  props: {
    currentCategory: {
      type: String,
      default: 'array'
    }
  },
  emits: [
    'category-change',
    'tool-select',
    'play-pause',
    'stop',
    'reset',
    'speed-change'
  ],
  setup(props, { emit }) {
    const appStore = useAppStore()

    const currentCategoryInfo = computed(() => {
      return appStore.categories.find(cat => cat.id === props.currentCategory)
    })

    // 이벤트 핸들러
    const handleCategoryChange = (categoryId) => {
      emit('category-change', categoryId)
    }

    const handleToolSelect = (tool) => {
      emit('tool-select', tool)
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

    const handleSpeedChange = (speed) => {
      emit('speed-change', speed)
    }

    return {
      appStore,
      currentCategoryInfo,
      handleCategoryChange,
      handleToolSelect,
      handlePlayPause,
      handleStop,
      handleReset,
      handleSpeedChange
    }
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.layout-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.default-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-placeholder {
  text-align: center;
  color: #6b7280;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.content-placeholder h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

@media (max-width: 768px) {
  .layout-content {
    flex-direction: column;
  }
  
  .main-content {
    margin: 0.5rem;
  }
}
</style> 