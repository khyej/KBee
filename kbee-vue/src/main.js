import './assets/main.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useUserStore } from '@/stores/user';

// FontAwesome 관련 설정
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas, far); // 둘 다 한 줄로 등록 가능

const app = createApp(App);

// FontAwesome 컴포넌트 등록
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);

// 사용자 정보 복원 및 불러오기
const userStore = useUserStore();
userStore.restoreUser();
userStore.fetchUser();

app.mount('#app');
