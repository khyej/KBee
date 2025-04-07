import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import StatsView from '../views/StatsView.vue';
import HistoryView from '../views/HistoryView.vue';
import LoginView from '../views/LoginView.vue';
import Logout from '../components/Logout.vue';
import MypageView from '@/views/MypageView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/stats', component: StatsView },
  { path: '/history', component: HistoryView },
  { path: '/login', component: LoginView },
  { path: '/logout', component: Logout },
  { path: '/mypage', component: MypageView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
