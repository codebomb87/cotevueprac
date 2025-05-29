<template>
  <div class="workspace">
    <!-- 상단 네비게이션 바 -->
    <nav class="navbar">
      <div class="nav-left">
        <router-link to="/" class="home-link">
          🏠 홈으로
        </router-link>
        <span class="category-title">
          {{ currentCategoryInfo?.icon }} {{ currentCategoryInfo?.title }}
        </span>
      </div>
      <div class="nav-right">
        <span class="status">준비 완료</span>
      </div>
    </nav>

    <div class="workspace-content">
      <!-- 좌측 사이드바 -->
      <aside class="sidebar">
        <div class="category-selector">
          <h3>카테고리</h3>
          <div class="category-list">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="['category-btn', { active: currentCategory === category.id }]"
              @click="changeCategory(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.title }}</span>
            </button>
          </div>
        </div>

        <div class="tools-panel">
          <h3>도구</h3>
          <div class="tools-list">
            <div v-if="currentCategory === 'array'" class="tool-group">
              <h4>정렬 알고리즘</h4>
              <button class="tool-btn">버블 정렬</button>
              <button class="tool-btn">선택 정렬</button>
              <button class="tool-btn">삽입 정렬</button>
            </div>
            <div v-else-if="currentCategory === 'graph'" class="tool-group">
              <h4>탐색 알고리즘</h4>
              <button class="tool-btn">DFS</button>
              <button class="tool-btn">BFS</button>
              <button class="tool-btn">다익스트라</button>
            </div>
            <div v-else class="tool-group">
              <p class="coming-soon">곧 제공될 예정입니다.</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- 메인 캔버스 영역 -->
      <main class="canvas-area">
        <div class="canvas-header">
          <h2>{{ currentCategoryInfo?.description }}</h2>
          <div class="canvas-info">
            알고리즘을 선택하고 데이터를 추가해보세요.
          </div>
        </div>

        <div class="canvas-container">
          <div class="canvas-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">🎨</div>
              <h3>캔버스 영역</h3>
              <p>여기에 알고리즘 시각화가 표시됩니다.</p>
              <p class="placeholder-hint">좌측에서 도구를 선택해주세요.</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 하단 컨트롤 패널 -->
    <footer class="control-panel">
      <div class="controls">
        <button class="control-btn" disabled>
          <span>⏯️</span> 재생/일시정지
        </button>
        <button class="control-btn" disabled>
          <span>⏹️</span> 정지
        </button>
        <button class="control-btn" disabled>
          <span>🔄</span> 초기화
        </button>
      </div>
      
      <div class="speed-control">
        <label for="speed">속도:</label>
        <input 
          id="speed" 
          type="range" 
          min="1" 
          max="5" 
          value="3" 
          disabled
        >
        <span>3x</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'WorkspaceView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const currentCategory = ref('array')
    
    const categories = [
      {
        id: 'array',
        icon: '📊',
        title: '배열',
        description: '정렬과 탐색 알고리즘'
      },
      {
        id: 'graph',
        icon: '🌐',
        title: '그래프',
        description: '그래프 탐색과 최단경로'
      },
      {
        id: 'visited-array',
        icon: '🗺️',
        title: '방문배열',
        description: '백트래킹과 미로 탐색'
      },
      {
        id: 'tree',
        icon: '🌳',
        title: '트리',
        description: '트리 구조와 순회'
      },
      {
        id: 'string',
        icon: '📝',
        title: '문자열',
        description: '패턴 매칭과 문자열 처리'
      }
    ]

    const currentCategoryInfo = computed(() => {
      return categories.find(cat => cat.id === currentCategory.value)
    })

    const changeCategory = (categoryId) => {
      currentCategory.value = categoryId
      router.push({
        name: 'workspace',
        query: { category: categoryId }
      })
    }

    // URL 쿼리에서 카테고리 초기화
    onMounted(() => {
      const categoryFromQuery = route.query.category
      if (categoryFromQuery && categories.find(cat => cat.id === categoryFromQuery)) {
        currentCategory.value = categoryFromQuery
      }
    })

    return {
      currentCategory,
      categories,
      currentCategoryInfo,
      changeCategory
    }
  }
}
</script>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

/* 상단 네비게이션 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.home-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.home-link:hover {
  color: #4f46e5;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
}

.status {
  color: #059669;
  font-weight: 500;
}

/* 워크스페이스 컨텐츠 */
.workspace-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 사이드바 */
.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.category-selector {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
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
}

.tools-panel {
  padding: 1.5rem;
}

.tool-group h4 {
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 0.75rem;
}

.tool-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.tool-btn:hover {
  border-color: #6366f1;
  background: #f8fafc;
}

.coming-soon {
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 2rem 0;
}

/* 캔버스 영역 */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.canvas-header {
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.canvas-header h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.canvas-info {
  color: #64748b;
  font-size: 0.9rem;
}

.canvas-container {
  flex: 1;
  position: relative;
  padding: 2rem;
}

.canvas-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
}

.placeholder-content {
  text-align: center;
  color: #6b7280;
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

.placeholder-hint {
  font-size: 0.9rem;
  margin-top: 1rem;
  color: #9ca3af;
}

/* 컨트롤 패널 */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.controls {
  display: flex;
  gap: 1rem;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.control-btn:not(:disabled):hover {
  border-color: #6366f1;
  background: #f8fafc;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.speed-control input {
  width: 100px;
}

@media (max-width: 768px) {
  .workspace-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    max-height: 200px;
  }
  
  .navbar {
    padding: 1rem;
  }
  
  .nav-left {
    gap: 1rem;
  }
}
</style> 