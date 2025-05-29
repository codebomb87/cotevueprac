<template>
  <div class="home">
    <header class="hero">
      <h1 class="title">🎯 코딩테스트 교육 도구</h1>
      <p class="subtitle">인터랙티브 알고리즘 시각화로 배우는 프로그래밍</p>
    </header>

    <main class="categories">
      <h2>알고리즘 카테고리를 선택하세요</h2>
      
      <div class="category-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card"
          @click="navigateToWorkspace(category.id)"
        >
          <div class="card-icon">{{ category.icon }}</div>
          <h3 class="card-title">{{ category.title }}</h3>
          <p class="card-description">{{ category.description }}</p>
          <ul class="card-features">
            <li v-for="feature in category.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()

    const categories = [
      {
        id: 'array',
        icon: '📊',
        title: '배열 (Array)',
        description: '기초 알고리즘 마스터',
        features: ['정렬 알고리즘', '탐색 알고리즘', '시간복잡도 비교']
      },
      {
        id: 'graph',
        icon: '🌐',
        title: '그래프 (Graph)',
        description: '중급 알고리즘 정복',
        features: ['DFS/BFS 탐색', '최단경로', '연결성 분석']
      },
      {
        id: 'visited-array',
        icon: '🗺️',
        title: '방문배열 (Visited)',
        description: '문제해결 패턴',
        features: ['백트래킹', '미로 탐색', '조합 생성']
      },
      {
        id: 'tree',
        icon: '🌳',
        title: '트리 (Tree)',
        description: '자료구조 이해',
        features: ['이진탐색트리', '트리 순회', '균형 트리']
      },
      {
        id: 'string',
        icon: '📝',
        title: '문자열 (String)',
        description: '패턴 인식',
        features: ['패턴 매칭', 'KMP 알고리즘', '편집 거리']
      }
    ]

    const navigateToWorkspace = (categoryId) => {
      router.push({
        name: 'workspace',
        query: { category: categoryId }
      })
    }

    return {
      categories,
      navigateToWorkspace
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero {
  text-align: center;
  padding: 4rem 2rem 2rem;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.categories {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.categories h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.5rem;
  opacity: 0.95;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.category-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.card-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.card-description {
  text-align: center;
  opacity: 0.8;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.card-features {
  list-style: none;
}

.card-features li {
  padding: 0.3rem 0;
  padding-left: 1rem;
  position: relative;
  opacity: 0.9;
}

.card-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4ade80;
  font-weight: bold;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .hero {
    padding: 2rem 1rem;
  }
}
</style> 