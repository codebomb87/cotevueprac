<template>
  <MainLayout 
    :current-category="appStore.currentCategory"
    @category-change="handleCategoryChange"
    @tool-select="handleToolSelect"
    @play-pause="handlePlayPause"
    @stop="handleStop"
    @reset="handleReset"
    @speed-change="handleSpeedChange"
  >
    <template #content>
      <div class="workspace-content">
        <div class="canvas-header">
          <h2>{{ appStore.currentCategoryInfo?.description }}</h2>
          <div class="canvas-info">
            <span class="status-badge" :class="statusClass">
              {{ appStore.currentStatus }}
            </span>
            <span v-if="appStore.currentTool" class="tool-info">
              {{ appStore.currentTool.name }} 선택됨
            </span>
            <span v-else class="help-text">
              좌측에서 알고리즘을 선택해주세요
            </span>
          </div>
        </div>

        <div class="canvas-container">
          <!-- 도구가 선택되지 않은 경우 -->
          <div v-if="!appStore.currentTool" class="canvas-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">🎨</div>
              <h3>알고리즘 시각화 영역</h3>
              <p>여기에 선택한 알고리즘의 동작 과정이 표시됩니다.</p>
              <div class="placeholder-steps">
                <div class="step">
                  <span class="step-number">1</span>
                  <span class="step-text">좌측에서 카테고리 선택</span>
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  <span class="step-text">알고리즘 도구 선택</span>
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  <span class="step-text">데이터 추가 및 실행</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 도구가 선택된 경우 -->
          <div v-else class="canvas-active">
            <div class="tool-header">
              <h3>{{ appStore.currentTool.name }}</h3>
              <p>{{ appStore.currentTool.description }}</p>
              <div class="complexity-info">
                <span class="complexity-item">
                  <strong>시간:</strong> {{ appStore.currentTool.timeComplexity }}
                </span>
                <span class="complexity-item">
                  <strong>공간:</strong> {{ appStore.currentTool.spaceComplexity }}
                </span>
              </div>
            </div>

            <div class="visualization-area">
              <!-- Canvas 컴포넌트 -->
              <Canvas
                :elements="appStore.canvasData.elements"
                :connections="appStore.canvasData.connections"
                :selected-elements="appStore.canvasData.selectedElements"
                :show-minimap="false"
                @element-move="handleElementMove"
                @element-select="handleElementSelect"
                @element-delete="handleElementDelete"
                @element-duplicate="handleElementDuplicate"
                @element-connect="handleElementConnect"
                @connection-select="handleConnectionSelect"
                @connection-delete="handleConnectionDelete"
                @canvas-click="handleCanvasClick"
                @grid-toggle="handleGridToggle"
                @snap-toggle="handleSnapToggle"
              />
              
              <!-- 캔버스가 비어있을 때 표시할 안내 -->
              <div v-if="appStore.canvasData.elements.length === 0" class="empty-canvas-overlay">
                <div class="empty-canvas-content">
                  <div class="empty-icon">🎯</div>
                  <h4>{{ appStore.currentTool.name }} 시각화</h4>
                  <p>아래 버튼으로 데이터를 추가해보세요</p>
                </div>
              </div>
            </div>

            <!-- 도구 모음 -->
            <div class="tool-controls">
              <div class="control-section">
                <h5>데이터 관리</h5>
                <div class="control-buttons">
                  <BaseButton 
                    variant="primary" 
                    icon="📊" 
                    @click="addDemoData"
                  >
                    샘플 데이터 추가
                  </BaseButton>
                  <BaseButton 
                    variant="outline" 
                    icon="🎲" 
                    @click="generateRandomArray"
                  >
                    랜덤 배열 생성
                  </BaseButton>
                  <BaseButton 
                    variant="danger" 
                    icon="🗑️" 
                    @click="clearDemoData"
                    :disabled="appStore.canvasData.elements.length === 0"
                  >
                    초기화
                  </BaseButton>
                </div>
              </div>

              <!-- 데이터 입력 -->
              <div class="control-section">
                <h5>새 값 추가</h5>
                <div class="input-row">
                  <BaseInput
                    v-model="newValue"
                    type="number"
                    placeholder="1~100 사이의 숫자"
                    :min="1"
                    :max="100"
                    clearable
                    @enter="addCustomValue"
                  />
                  <BaseButton 
                    size="large"
                    icon="➕"
                    @click="addCustomValue"
                    :disabled="!newValue || newValue < 1 || newValue > 100"
                  >
                    추가
                  </BaseButton>
                </div>
              </div>

              <!-- 배열 크기 조절 -->
              <div class="control-section">
                <BaseSlider
                  v-model="arraySize"
                  label="배열 크기"
                  :min="3"
                  :max="20"
                  :value-formatter="(val) => `${val}개`"
                  show-min-max
                  @change="updateArraySize"
                />
              </div>

              <!-- 선택된 요소 정보 -->
              <div v-if="appStore.canvasData.selectedElements.length > 0" class="control-section">
                <h5>선택된 요소 ({{ appStore.canvasData.selectedElements.length }}개)</h5>
                <div class="selected-elements">
                  <div 
                    v-for="element in appStore.selectedElementsData" 
                    :key="element.id"
                    class="selected-element"
                  >
                    <span class="element-value">{{ element.value }}</span>
                    <span class="element-type">{{ getElementTypeName(element.type) }}</span>
                  </div>
                </div>
                <div class="selection-actions">
                  <BaseButton 
                    size="small" 
                    variant="outline" 
                    @click="duplicateSelected"
                  >
                    복제
                  </BaseButton>
                  <BaseButton 
                    size="small" 
                    variant="danger" 
                    @click="deleteSelected"
                  >
                    삭제
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import MainLayout from '@/components/common/MainLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSlider from '@/components/common/BaseSlider.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import Canvas from '@/components/canvas/Canvas.vue'

export default {
  name: 'WorkspaceView',
  components: {
    MainLayout,
    BaseButton,
    BaseInput,
    BaseSlider,
    BaseIcon,
    Canvas
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const appStore = useAppStore()
    
    // 새로운 상태들
    const newValue = ref('')
    const arraySize = ref(10)
    const selectedIcon = ref('')
    
    // URL 쿼리에서 카테고리 초기화
    onMounted(() => {
      const categoryFromQuery = route.query.category
      if (categoryFromQuery && appStore.categories.find(cat => cat.id === categoryFromQuery)) {
        appStore.setCategory(categoryFromQuery)
      }
    })

    // 상태에 따른 CSS 클래스
    const statusClass = computed(() => {
      if (appStore.isAnimating) {
        return 'status-running'
      }
      if (appStore.algorithmState.isCompleted) {
        return 'status-completed'
      }
      if (appStore.currentTool) {
        return 'status-ready'
      }
      return 'status-waiting'
    })

    // 기존 이벤트 핸들러들
    const handleCategoryChange = (categoryId) => {
      appStore.setCategory(categoryId)
      router.push({
        name: 'workspace',
        query: { category: categoryId }
      })
    }

    const handleToolSelect = (tool) => {
      appStore.setTool(tool)
    }

    const handlePlayPause = () => {
      if (appStore.isAnimating) {
        if (appStore.isPaused) {
          appStore.resumeAnimation()
        } else {
          appStore.pauseAnimation()
        }
      } else {
        appStore.startAnimation()
        // 임시: 5초 후 완료 처리
        setTimeout(() => {
          appStore.stopAnimation()
          appStore.algorithmState.isCompleted = true
        }, 5000)
      }
    }

    const handleStop = () => {
      appStore.stopAnimation()
    }

    const handleReset = () => {
      appStore.resetAlgorithmState()
    }

    const handleSpeedChange = (speed) => {
      appStore.setAnimationSpeed(speed)
    }

    // 기존 데모 함수들
    const addDemoData = () => {
      const randomValue = Math.floor(Math.random() * 100) + 1
      const elementCount = appStore.canvasData.elements.length
      appStore.addCanvasElement({
        id: Date.now() + Math.random(),
        type: 'array-element',
        value: randomValue,
        x: elementCount * 70 + 50,
        y: 100,
        index: elementCount,
        width: 60,
        height: 40
      })
      
      // 단계 수 업데이트
      appStore.setTotalSteps(appStore.canvasData.elements.length * 2)
    }

    const clearDemoData = () => {
      appStore.resetCanvasData()
      appStore.resetAlgorithmState()
      newValue.value = ''
      selectedIcon.value = ''
    }

    const generateRandomArray = () => {
      appStore.resetCanvasData()
      
      for (let i = 0; i < arraySize.value; i++) {
        const randomValue = Math.floor(Math.random() * 100) + 1
        appStore.addCanvasElement({
          id: Date.now() + i,
          type: 'array-element',
          value: randomValue,
          x: i * 70 + 50,
          y: 100,
          index: i,
          width: 60,
          height: 40
        })
      }
      
      appStore.setTotalSteps(arraySize.value * 2)
    }

    const addCustomValue = () => {
      if (newValue.value && newValue.value >= 1 && newValue.value <= 100) {
        const elementCount = appStore.canvasData.elements.length
        appStore.addCanvasElement({
          id: Date.now() + Math.random(),
          type: 'array-element',
          value: parseInt(newValue.value),
          x: elementCount * 70 + 50,
          y: 100,
          index: elementCount,
          width: 60,
          height: 40
        })
        
        appStore.setTotalSteps(appStore.canvasData.elements.length * 2)
        newValue.value = ''
      }
    }

    const updateArraySize = (size) => {
      arraySize.value = size
      // 배열 크기가 변경되면 자동으로 새 배열 생성
      if (appStore.canvasData.elements.length > 0) {
        generateRandomArray()
      }
    }

    const showIconDemo = (iconName) => {
      selectedIcon.value = iconName
      console.log(`아이콘 클릭됨: ${iconName}`)
    }

    // 캔버스 이벤트 핸들러들
    const handleElementMove = (elementId, newPosition) => {
      appStore.updateCanvasElement(elementId, newPosition)
    }

    const handleElementSelect = (elementId, multiSelect = false) => {
      appStore.selectElement(elementId, multiSelect)
    }

    const handleElementDelete = (elementId) => {
      appStore.removeCanvasElement(elementId)
    }

    const handleElementDuplicate = (elementId) => {
      appStore.duplicateElement(elementId)
    }

    const handleElementConnect = (fromElementId, toElementId) => {
      // 연결선 생성 로직
      const fromElement = appStore.canvasData.elements.find(el => el.id === fromElementId)
      const toElement = appStore.canvasData.elements.find(el => el.id === toElementId)
      
      if (fromElement && toElement) {
        appStore.addCanvasConnection({
          id: Date.now() + Math.random(),
          fromId: fromElementId,
          toId: toElementId,
          from: { x: fromElement.x + fromElement.width / 2, y: fromElement.y + fromElement.height / 2 },
          to: { x: toElement.x + toElement.width / 2, y: toElement.y + toElement.height / 2 },
          type: 'default'
        })
      }
    }

    const handleConnectionSelect = (connectionId) => {
      appStore.selectConnection(connectionId)
    }

    const handleConnectionDelete = (connectionId) => {
      appStore.removeCanvasConnection(connectionId)
    }

    const handleCanvasClick = (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        appStore.clearSelection()
      }
    }

    const handleGridToggle = (isGridVisible) => {
      appStore.toggleGrid()
    }

    const handleSnapToggle = (isSnapEnabled) => {
      appStore.toggleSnapToGrid()
    }

    const getElementTypeName = (type) => {
      const typeNames = {
        'array-element': '배열 요소',
        'graph-node': '그래프 노드',
        'tree-node': '트리 노드',
        'string-char': '문자'
      }
      return typeNames[type] || type
    }

    const duplicateSelected = () => {
      appStore.canvasData.selectedElements.forEach(elementId => {
        appStore.duplicateElement(elementId)
      })
    }

    const deleteSelected = () => {
      appStore.canvasData.selectedElements.forEach(elementId => {
        appStore.removeCanvasElement(elementId)
      })
      appStore.clearSelection()
    }

    return {
      appStore,
      newValue,
      arraySize,
      selectedIcon,
      statusClass,
      handleCategoryChange,
      handleToolSelect,
      handlePlayPause,
      handleStop,
      handleReset,
      handleSpeedChange,
      addDemoData,
      clearDemoData,
      generateRandomArray,
      addCustomValue,
      updateArraySize,
      showIconDemo,
      handleElementMove,
      handleElementSelect,
      handleElementDelete,
      handleElementDuplicate,
      handleElementConnect,
      handleConnectionSelect,
      handleConnectionDelete,
      handleCanvasClick,
      handleGridToggle,
      handleSnapToggle,
      getElementTypeName,
      duplicateSelected,
      deleteSelected
    }
  }
}
</script>

<style scoped>
.workspace-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.canvas-header {
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.canvas-header h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.canvas-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-waiting {
  background: #f1f5f9;
  color: #64748b;
}

.status-ready {
  background: #dcfce7;
  color: #16a34a;
}

.status-running {
  background: #dbeafe;
  color: #2563eb;
}

.status-completed {
  background: #fef3c7;
  color: #d97706;
}

.tool-info {
  color: #6366f1;
  font-weight: 500;
  font-size: 0.9rem;
}

.help-text {
  color: #64748b;
  font-size: 0.9rem;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.canvas-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.placeholder-content {
  text-align: center;
  color: #6b7280;
  max-width: 400px;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.placeholder-content h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.placeholder-steps {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.step-text {
  color: #374151;
  font-size: 0.9rem;
}

.canvas-active {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-header {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.tool-header h3 {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.tool-header p {
  color: #64748b;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.complexity-info {
  display: flex;
  gap: 1.5rem;
}

.complexity-item {
  font-size: 0.85rem;
  color: #6b7280;
}

.visualization-area {
  flex: 1;
  position: relative;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
}

.visualization-placeholder {
  text-align: center;
  color: #6b7280;
  max-width: 400px;
}

.visualization-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.visualization-placeholder h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.demo-controls {
  margin: 2rem 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.demo-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.demo-btn:hover {
  border-color: #6366f1;
  background: #f8fafc;
}

.demo-data {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  text-align: left;
}

.demo-data h5 {
  margin-bottom: 0.75rem;
  color: #374151;
  font-size: 0.9rem;
}

.data-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.data-item {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #374151;
}

.input-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
}

.input-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-demo {
  margin-top: 2rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
}

.icon-grid {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.icon-result {
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

.tool-controls {
  padding: 1.5rem 2rem;
  padding-bottom: 120px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.control-section {
  margin-bottom: 1.5rem;
}

.control-buttons {
  display: flex;
  gap: 1rem;
}

.empty-canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-canvas-content {
  text-align: center;
  color: #6b7280;
  max-width: 400px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-canvas-content h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.empty-canvas-content p {
  font-size: 0.9rem;
}

.selected-elements {
  margin-bottom: 1rem;
}

.selected-element {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #374151;
}

.selection-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 1024px) {
  .tool-controls {
    padding-bottom: 140px;
  }
}

@media (max-width: 768px) {
  .canvas-header {
    padding: 1rem;
  }
  
  .tool-header {
    padding: 1rem;
  }
  
  .tool-controls {
    padding-bottom: 160px;
  }
  
  .complexity-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .demo-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style> 