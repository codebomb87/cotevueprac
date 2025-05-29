<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="home-link">
        🏠 홈으로
      </router-link>
      <span class="category-title">
        {{ currentCategoryInfo?.icon }} {{ currentCategoryInfo?.name }}
      </span>
    </div>
    
    <div class="nav-center">
      <span class="app-title">알고리즘 시각화 도구</span>
    </div>
    
    <div class="nav-right">
      <span class="status">{{ status }}</span>
      <button class="settings-btn" @click="$emit('settings-toggle')">
        ⚙️
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    currentCategory: {
      type: String,
      default: 'array'
    },
    currentCategoryInfo: {
      type: Object,
      default: () => ({})
    },
    status: {
      type: String,
      default: '준비 완료'
    }
  },
  emits: ['settings-toggle']
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-height: 60px;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-right {
  justify-content: flex-end;
}

.home-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.home-link:hover {
  color: #4f46e5;
  background: #f1f5f9;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
}

.app-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  opacity: 0.8;
}

.status {
  color: #059669;
  font-weight: 500;
  font-size: 0.9rem;
}

.settings-btn {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.settings-btn:hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .nav-left,
  .nav-right {
    gap: 1rem;
    flex: none;
  }
  
  .nav-center {
    display: none;
  }
  
  .category-title {
    font-size: 1rem;
  }
  
  .app-title {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .category-title {
    font-size: 0.9rem;
  }
}
</style> 