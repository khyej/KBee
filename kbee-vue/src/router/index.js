import Startview from '@/views/Startview.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: Startview },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/mypage', component: () => import('../views/MypageView.vue') },
  { path: '/calendar', component: () => import('../views/CalendarView.vue') },
  { path: '/history', component: () => import('../views/HistoryView.vue') },
  { path: '/signup', component: () => import('../views/SignupView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 로그인 안 된 상태에서 보호가 필요한 라우트 접근 차단
router.beforeEach(async (to, from, next) => {
  const { useUserStore } = await import('@/stores/user');
  const userStore = useUserStore();

  userStore.restoreUser();

  if (!['/', '/login', '/signup'].includes(to.path) && !userStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
