<template>
  <!-- 로그아웃 버튼 클릭 시 logout 메서드 실행 -->
  <button @click="logout">로그아웃</button>
</template>

<script setup>
// 라우팅 처리를 위한 vue-router
import { useRouter } from 'vue-router';
// 사용자 상태 관리를 위한 Pinia store
import { useUserStore } from '@/stores/user';

// 라우터 인스턴스
const router = useRouter();
// 사용자 store 인스턴스
const userStore = useUserStore();

// 로그아웃 처리 함수
const logout = () => {
  userStore.logout();    // 사용자 상태 초기화
  router.push('/');      // 홈 화면으로 이동
};
</script>
