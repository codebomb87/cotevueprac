<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 사이드바 토글 버튼 -->
    <button class="sidebar-toggle" @click="toggleSidebar">
      {{ isCollapsed ? '📂' : '📁' }}
    </button>

    <div class="sidebar-content" v-show="!isCollapsed">
      <!-- 카테고리 선택 -->
      <div class="category-selector">
        <h3>카테고리</h3>
        <div class="category-list">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-btn', { active: currentCategory === category.id }]"
            @click="selectCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </button>
        </div>
      </div>

      <!-- 도구 패널 -->
      <div class="tools-panel">
        <h3>도구</h3>
        <div class="tools-list">
          <!-- 배열 도구 -->
          <div v-if="currentCategory === 'array'" class="tool-group">
            <h4>정렬 알고리즘</h4>
            <button 
              v-for="tool in arrayTools.sorting" 
              :key="tool.id"
              :class="['tool-btn', { active: selectedTool === tool.id }]"
              @click="selectTool(tool)"
            >
              {{ tool.name }}
            </button>
            
            <h4>탐색 알고리즘</h4>
            <button 
              v-for="tool in arrayTools.search" 
              :key="tool.id"
              :class="['tool-btn', { active: selectedTool === tool.id }]"
              @click="selectTool(tool)"
            >
              {{ tool.name }}
            </button>
          </div>

          <!-- 그래프 도구 -->
          <div v-else-if="currentCategory === 'graph'" class="tool-group">
            <h4>탐색 알고리즘</h4>
            <button 
              v-for="tool in graphTools.traversal" 
              :key="tool.id"
              :class="['tool-btn', { active: selectedTool === tool.id }]"
              @click="selectTool(tool)"
            >
              {{ tool.name }}
            </button>
            
            <h4>최단경로</h4>
            <button 
              v-for="tool in graphTools.shortest" 
              :key="tool.id"
              :class="['tool-btn', { active: selectedTool === tool.id }]"
              @click="selectTool(tool)"
            >
              {{ tool.name }}
            </button>
          </div>

          <!-- 기타 카테고리 -->
          <div v-else class="tool-group">
            <p class="coming-soon">
              {{ currentCategoryInfo?.name }} 도구는 곧 제공될 예정입니다.
            </p>
          </div>
        </div>
      </div>

      <!-- 도구 설명 -->
      <div v-if="selectedToolInfo" class="tool-info">
        <h4>{{ selectedToolInfo.name }}</h4>
        <p class="tool-description">{{ selectedToolInfo.description }}</p>
        <div class="tool-complexity">
          <small>
            <strong>시간복잡도:</strong> {{ selectedToolInfo.timeComplexity }}<br>
            <strong>공간복잡도:</strong> {{ selectedToolInfo.spaceComplexity }}
          </small>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Sidebar',
  props: {
    currentCategory: {
      type: String,
      default: 'array'
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['category-change', 'tool-select'],
  setup(props, { emit }) {
    const isCollapsed = ref(false)
    const selectedTool = ref(null)

    // 도구 정의
    const arrayTools = {
      sorting: [
        {
          id: 'bubble-sort',
          name: '버블 정렬',
          description: '인접한 원소를 비교하여 정렬하는 가장 기본적인 알고리즘',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)'
        },
        {
          id: 'selection-sort',
          name: '선택 정렬',
          description: '최솟값을 찾아 앞으로 이동시키는 정렬 알고리즘',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)'
        },
        {
          id: 'insertion-sort',
          name: '삽입 정렬',
          description: '정렬된 부분에 새로운 원소를 적절한 위치에 삽입',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)'
        },
        {
          id: 'quick-sort',
          name: '퀵 정렬',
          description: '분할 정복을 이용한 빠른 정렬 알고리즘',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(log n)'
        },
        {
          id: 'merge-sort',
          name: '병합 정렬',
          description: '분할 정복을 이용한 안정적인 정렬 알고리즘',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)'
        }
      ],
      search: [
        {
          id: 'linear-search',
          name: '선형 탐색',
          description: '배열을 처음부터 끝까지 순차적으로 탐색',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        },
        {
          id: 'binary-search',
          name: '이진 탐색',
          description: '정렬된 배열에서 반으로 나누어 탐색',
          timeComplexity: 'O(log n)',
          spaceComplexity: 'O(1)'
        }
      ]
    }

    const graphTools = {
      traversal: [
        {
          id: 'dfs',
          name: 'DFS',
          description: '깊이 우선 탐색으로 그래프를 순회',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)'
        },
        {
          id: 'bfs',
          name: 'BFS',
          description: '너비 우선 탐색으로 그래프를 순회',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)'
        }
      ],
      shortest: [
        {
          id: 'dijkstra',
          name: '다익스트라',
          description: '양의 가중치를 가진 그래프에서 최단경로 탐색',
          timeComplexity: 'O((V + E) log V)',
          spaceComplexity: 'O(V)'
        },
        {
          id: 'astar',
          name: 'A*',
          description: '휴리스틱을 사용한 최적 경로 탐색 알고리즘',
          timeComplexity: 'O(b^d)',
          spaceComplexity: 'O(b^d)'
        }
      ]
    }

    const currentCategoryInfo = computed(() => {
      return props.categories.find(cat => cat.id === props.currentCategory)
    })

    const selectedToolInfo = computed(() => {
      if (!selectedTool.value) return null
      
      const allTools = [
        ...arrayTools.sorting,
        ...arrayTools.search,
        ...graphTools.traversal,
        ...graphTools.shortest
      ]
      
      return allTools.find(tool => tool.id === selectedTool.value)
    })

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const selectCategory = (categoryId) => {
      selectedTool.value = null
      emit('category-change', categoryId)
    }

    const selectTool = (tool) => {
      selectedTool.value = tool.id
      emit('tool-select', tool)
    }

    return {
      isCollapsed,
      selectedTool,
      arrayTools,
      graphTools,
      currentCategoryInfo,
      selectedToolInfo,
      toggleSidebar,
      selectCategory,
      selectTool
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  position: relative;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: -15px;
  width: 30px;
  height: 30px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  background: #f8fafc;
  transform: scale(1.1);
}

.sidebar-content {
  padding: 1rem;
}

.category-selector {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.category-selector h3,
.tools-panel h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.category-btn:hover {
  background: #f1f5f9;
}

.category-btn.active {
  background: #eef2ff;
  color: #6366f1;
}

.category-icon {
  font-size: 1.2rem;
}

.category-name {
  font-weight: 500;
  color: #1e293b;
}

.tool-group h4 {
  font-size: 0.85rem;
  color: #1e293b;
  margin: 1rem 0 0.75rem 0;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
  font-weight: 600;
}

.tool-group:first-child h4 {
  margin-top: 0;
  border-top: none;
  padding-top: 0;
}

.tool-btn {
  display: block;
  width: 100%;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
}

.tool-btn:hover {
  border-color: #6366f1;
  background: #f8fafc;
}

.tool-btn.active {
  border-color: #6366f1;
  background: #eef2ff;
  color: #6366f1;
  font-weight: 500;
}

.coming-soon {
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 2rem 0;
  font-size: 0.9rem;
}

.tool-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tool-info h4 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.tool-description {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.tool-complexity {
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.3;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-height: 250px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .sidebar.collapsed {
    max-height: 60px;
    width: 100%;
  }
  
  .sidebar-toggle {
    top: 1rem;
    right: 1rem;
  }
  
  .sidebar-content {
    padding: 0.5rem;
  }
  
  .tool-info {
    display: none;
  }
}
</style> 