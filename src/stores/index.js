import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ========== 기본 상태 ==========
  
  // 현재 선택된 카테고리
  const currentCategory = ref('array')
  
  // 현재 선택된 도구
  const currentTool = ref(null)
  
  // 애니메이션 상태
  const isAnimating = ref(false)
  const isPaused = ref(false)
  const animationSpeed = ref(3)
  
  // 캔버스 데이터
  const canvasData = ref({
    elements: [],
    connections: [],
    gridSize: 20,
    showGrid: true,
    snapToGrid: true,
    selectedElements: [],
    selectedConnections: []
  })
  
  // 알고리즘 실행 상태
  const algorithmState = ref({
    currentStep: 0,
    totalSteps: 0,
    executionTime: 0,
    isCompleted: false,
    stepHistory: []
  })
  
  // UI 상태
  const uiState = ref({
    sidebarCollapsed: false,
    showSettings: false,
    theme: 'light'
  })

  // ========== 카테고리 정보 ==========
  const categories = ref([
    {
      id: 'array',
      name: '배열',
      icon: '📊',
      description: '배열 기반 정렬 및 탐색 알고리즘',
      tools: [
        {
          id: 'bubble-sort',
          name: '버블 정렬',
          description: '인접한 두 원소를 비교하여 정렬하는 알고리즘',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          category: 'sorting'
        },
        {
          id: 'selection-sort',
          name: '선택 정렬',
          description: '최솟값을 찾아 맨 앞으로 보내는 정렬 알고리즘',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          category: 'sorting'
        },
        {
          id: 'insertion-sort',
          name: '삽입 정렬',
          description: '정렬된 부분에 새 원소를 적절한 위치에 삽입',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          category: 'sorting'
        },
        {
          id: 'quick-sort',
          name: '퀵 정렬',
          description: '분할 정복을 이용한 빠른 정렬 알고리즘',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(log n)',
          category: 'sorting'
        },
        {
          id: 'merge-sort',
          name: '병합 정렬',
          description: '분할 정복을 이용한 안정적인 정렬 알고리즘',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)',
          category: 'sorting'
        },
        {
          id: 'linear-search',
          name: '선형 탐색',
          description: '배열을 처음부터 끝까지 순차적으로 탐색',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          category: 'search'
        },
        {
          id: 'binary-search',
          name: '이진 탐색',
          description: '정렬된 배열에서 중간값을 이용한 탐색',
          timeComplexity: 'O(log n)',
          spaceComplexity: 'O(1)',
          category: 'search'
        }
      ]
    },
    {
      id: 'graph',
      name: '그래프',
      icon: '🌐',
      description: '그래프 탐색 및 최단경로 알고리즘',
      tools: [
        {
          id: 'dfs',
          name: '깊이 우선 탐색 (DFS)',
          description: '스택을 이용하여 그래프를 깊이 우선으로 탐색',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)',
          category: 'traversal'
        },
        {
          id: 'bfs',
          name: '너비 우선 탐색 (BFS)',
          description: '큐를 이용하여 그래프를 너비 우선으로 탐색',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)',
          category: 'traversal'
        },
        {
          id: 'dijkstra',
          name: '다익스트라 알고리즘',
          description: '단일 출발점에서 모든 정점까지의 최단경로',
          timeComplexity: 'O(V²)',
          spaceComplexity: 'O(V)',
          category: 'shortest-path'
        }
      ]
    },
    {
      id: 'visited-array',
      name: '방문배열',
      icon: '🗺️',
      description: '2D 그리드에서의 경로 탐색 알고리즘',
      tools: [
        {
          id: 'grid-dfs',
          name: '그리드 DFS',
          description: '2D 그리드에서 깊이 우선 탐색',
          timeComplexity: 'O(n × m)',
          spaceComplexity: 'O(n × m)',
          category: 'pathfinding'
        },
        {
          id: 'grid-bfs',
          name: '그리드 BFS',
          description: '2D 그리드에서 너비 우선 탐색',
          timeComplexity: 'O(n × m)',
          spaceComplexity: 'O(n × m)',
          category: 'pathfinding'
        },
        {
          id: 'a-star',
          name: 'A* 알고리즘',
          description: '휴리스틱을 이용한 최적 경로 탐색',
          timeComplexity: 'O(b^d)',
          spaceComplexity: 'O(b^d)',
          category: 'pathfinding'
        }
      ]
    },
    {
      id: 'tree',
      name: '트리',
      icon: '🌳',
      description: '트리 자료구조 및 순회 알고리즘',
      tools: [
        {
          id: 'bst',
          name: '이진 탐색 트리',
          description: '이진 탐색 트리의 삽입, 삭제, 탐색',
          timeComplexity: 'O(log n)',
          spaceComplexity: 'O(n)',
          category: 'tree-structure'
        },
        {
          id: 'tree-traversal',
          name: '트리 순회',
          description: '전위, 중위, 후위, 레벨 순회',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h)',
          category: 'traversal'
        }
      ]
    },
    {
      id: 'string',
      name: '문자열',
      icon: '📝',
      description: '문자열 패턴 매칭 알고리즘',
      tools: [
        {
          id: 'naive-matching',
          name: '단순 매칭',
          description: '브루트 포스 방식의 패턴 매칭',
          timeComplexity: 'O(n × m)',
          spaceComplexity: 'O(1)',
          category: 'pattern-matching'
        },
        {
          id: 'kmp',
          name: 'KMP 알고리즘',
          description: '실패 함수를 이용한 효율적인 패턴 매칭',
          timeComplexity: 'O(n + m)',
          spaceComplexity: 'O(m)',
          category: 'pattern-matching'
        }
      ]
    }
  ])

  // ========== Computed Properties ==========
  
  // 현재 카테고리 정보
  const currentCategoryInfo = computed(() => {
    return categories.value.find(cat => cat.id === currentCategory.value)
  })
  
  // 현재 도구 정보
  const currentToolInfo = computed(() => {
    return currentTool.value
  })
  
  // 애니메이션 제어 가능 여부
  const canControl = computed(() => {
    return currentTool.value !== null
  })
  
  // 현재 상태 요약
  const currentStatus = computed(() => {
    if (isAnimating.value) {
      return isPaused.value ? '일시정지됨' : '실행 중'
    }
    if (algorithmState.value.isCompleted) {
      return '완료됨'
    }
    if (currentTool.value) {
      return '준비됨'
    }
    return '대기 중'
  })

  // 캔버스 관련 computed
  const selectedElementsData = computed(() => {
    return canvasData.value.elements.filter(el => 
      canvasData.value.selectedElements.includes(el.id)
    )
  })
  
  const selectedConnectionsData = computed(() => {
    return canvasData.value.connections.filter(conn => 
      canvasData.value.selectedConnections.includes(conn.id)
    )
  })

  // ========== Actions ==========
  
  // 카테고리 변경
  const setCategory = (categoryId) => {
    currentCategory.value = categoryId
    currentTool.value = null
    resetCanvasData()
    resetAlgorithmState()
  }
  
  // 도구 선택
  const setTool = (tool) => {
    currentTool.value = tool
    resetAlgorithmState()
  }
  
  // 도구 초기화
  const resetTool = () => {
    currentTool.value = null
    resetAlgorithmState()
    resetCanvasData()
  }
  
  // 애니메이션 상태 관리
  const startAnimation = () => {
    isAnimating.value = true
    isPaused.value = false
    algorithmState.value.isCompleted = false
  }
  
  const pauseAnimation = () => {
    isPaused.value = true
  }
  
  const resumeAnimation = () => {
    isPaused.value = false
  }
  
  const stopAnimation = () => {
    isAnimating.value = false
    isPaused.value = false
  }
  
  // 애니메이션 속도 설정
  const setAnimationSpeed = (speed) => {
    animationSpeed.value = speed
  }
  
  // 알고리즘 상태 초기화
  const resetAlgorithmState = () => {
    algorithmState.value = {
      currentStep: 0,
      totalSteps: 0,
      executionTime: 0,
      isCompleted: false,
      stepHistory: []
    }
    stopAnimation()
  }
  
  // 알고리즘 단계 진행
  const nextStep = () => {
    if (algorithmState.value.currentStep < algorithmState.value.totalSteps) {
      algorithmState.value.currentStep++
    }
    
    if (algorithmState.value.currentStep >= algorithmState.value.totalSteps) {
      algorithmState.value.isCompleted = true
      stopAnimation()
    }
  }
  
  const previousStep = () => {
    if (algorithmState.value.currentStep > 0) {
      algorithmState.value.currentStep--
      algorithmState.value.isCompleted = false
    }
  }
  
  // 캔버스 데이터 관리
  const resetCanvasData = () => {
    canvasData.value = {
      elements: [],
      connections: [],
      gridSize: 20,
      showGrid: true,
      snapToGrid: true,
      selectedElements: [],
      selectedConnections: []
    }
  }
  
  const addCanvasElement = (element) => {
    const newElement = {
      id: element.id || Date.now() + Math.random(),
      type: element.type || 'array-element',
      x: element.x || 0,
      y: element.y || 0,
      width: element.width || 60,
      height: element.height || 40,
      value: element.value,
      state: element.state || 'default',
      ...element
    }
    canvasData.value.elements.push(newElement)
  }
  
  const removeCanvasElement = (elementId) => {
    canvasData.value.elements = canvasData.value.elements.filter(
      el => el.id !== elementId
    )
    // 관련된 연결선도 제거
    canvasData.value.connections = canvasData.value.connections.filter(
      conn => conn.fromId !== elementId && conn.toId !== elementId
    )
  }
  
  const updateCanvasElement = (elementId, updates) => {
    const index = canvasData.value.elements.findIndex(el => el.id === elementId)
    if (index !== -1) {
      canvasData.value.elements[index] = { 
        ...canvasData.value.elements[index], 
        ...updates 
      }
    }
  }
  
  // UI 상태 관리
  const toggleSidebar = () => {
    uiState.value.sidebarCollapsed = !uiState.value.sidebarCollapsed
  }
  
  const toggleSettings = () => {
    uiState.value.showSettings = !uiState.value.showSettings
  }
  
  const setTheme = (theme) => {
    uiState.value.theme = theme
  }
  
  // 실행 시간 업데이트
  const updateExecutionTime = (time) => {
    algorithmState.value.executionTime = time
  }
  
  // 전체 단계 수 설정
  const setTotalSteps = (steps) => {
    algorithmState.value.totalSteps = steps
  }

  // 캔버스 선택 관리
  const selectElement = (elementId, multiSelect = false) => {
    if (multiSelect) {
      const index = canvasData.value.selectedElements.indexOf(elementId)
      if (index === -1) {
        canvasData.value.selectedElements.push(elementId)
      } else {
        canvasData.value.selectedElements.splice(index, 1)
      }
    } else {
      canvasData.value.selectedElements = [elementId]
    }
  }

  const selectConnection = (connectionId) => {
    canvasData.value.selectedConnections = [connectionId]
  }

  const clearSelection = () => {
    canvasData.value.selectedElements = []
    canvasData.value.selectedConnections = []
  }

  // 요소 복제
  const duplicateElement = (elementId) => {
    const element = canvasData.value.elements.find(el => el.id === elementId)
    if (element) {
      const newElement = {
        ...element,
        id: Date.now() + Math.random(),
        x: element.x + 30,
        y: element.y + 30
      }
      canvasData.value.elements.push(newElement)
    }
  }

  // 연결선 관리
  const addCanvasConnection = (connection) => {
    const newConnection = {
      id: connection.id || Date.now() + Math.random(),
      fromId: connection.fromId,
      toId: connection.toId,
      from: connection.from,
      to: connection.to,
      type: connection.type || 'default',
      style: connection.style || 'orthogonal',
      ...connection
    }
    canvasData.value.connections.push(newConnection)
  }

  const removeCanvasConnection = (connectionId) => {
    canvasData.value.connections = canvasData.value.connections.filter(
      conn => conn.id !== connectionId
    )
  }

  // 그리드 설정
  const toggleGrid = () => {
    canvasData.value.showGrid = !canvasData.value.showGrid
  }

  const toggleSnapToGrid = () => {
    canvasData.value.snapToGrid = !canvasData.value.snapToGrid
  }

  // ========== Return ==========
  return {
    // State
    currentCategory,
    currentTool,
    isAnimating,
    isPaused,
    animationSpeed,
    canvasData,
    algorithmState,
    uiState,
    categories,
    
    // Computed
    currentCategoryInfo,
    currentToolInfo,
    canControl,
    currentStatus,
    selectedElementsData,
    selectedConnectionsData,
    
    // Actions
    setCategory,
    setTool,
    resetTool,
    startAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    setAnimationSpeed,
    resetAlgorithmState,
    nextStep,
    previousStep,
    resetCanvasData,
    addCanvasElement,
    removeCanvasElement,
    updateCanvasElement,
    toggleSidebar,
    toggleSettings,
    setTheme,
    updateExecutionTime,
    setTotalSteps,
    selectElement,
    selectConnection,
    clearSelection,
    duplicateElement,
    addCanvasConnection,
    removeCanvasConnection,
    toggleGrid,
    toggleSnapToGrid
  }
}) 