import { createRouter, createWebHistory } from 'vue-router';

// import HomeView from '../views/HomeView.vue';
import StatsView from '../views/StatsView.vue';
// import HistoryView from '../views/HistoryView.vue';
// import MypageView from '@/views/MypageView.vue';

const routes = [
    { path: '/', component: StatsView },
    { path: '/calender', component: () => import('../views/HomeView.vue') },
    { path: '/history', component: () => import('../views/HistoryView.vue') },
    { path: '/mypage', component: () => import('../views/MypageView.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
