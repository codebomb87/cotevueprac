import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '코딩테스트 교육 도구'
      }
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView,
      meta: {
        title: '알고리즘 워크스페이스'
      }
    }
  ]
})

// 페이지 제목 설정
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '코딩테스트 교육 도구'
  next()
})

export default router 