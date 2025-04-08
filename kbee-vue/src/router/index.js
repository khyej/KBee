import { createRouter, createWebHistory } from 'vue-router';

// import HomeView from '../views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
// import HistoryView from '../views/HistoryView.vue';
// import MypageView from '@/views/MypageView.vue';

const routes = [
    { path: '/', component: DashboardView },
    { path: '/calender', component: () => import('../views/CalendarView.vue') },
    { path: '/history', component: () => import('../views/HistoryView.vue') },
    { path: '/mypage', component: () => import('../views/MypageView.vue') },
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/signup', component: () => import('../views/SignupView.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
