<template>
  <!-- 전체 화면을 감싸는 메인 박스 -->
  <div class="main">
    <!-- 로고 이미지 박스 -->
    <div class="logo-box">
      <img src="@/assets/logo.png" />
    </div>

    <!-- 서비스 슬로건 텍스트 -->
    <div>Keep Budget every entry</div>
    <div>매일 예산 관리하는 습관</div>

    <!-- 시작 버튼 -->
    <div class="btn-wrapper">
      <button @click="start" class="start-button">시작하기</button>
    </div>
  </div>
</template>

<script setup>
// 라우터 및 사용자 Store 불러오기
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'; // 사용자 상태 저장소

// 라우터 객체
const router = useRouter();
// 사용자 상태 접근
const userStore = useUserStore();

// '시작하기' 버튼 클릭 시 처리
const start = () => {
  if (userStore.isLoggedIn) {
    // 로그인 상태면 대시보드로 이동
    router.push('/dashboard');
  } else {
    // 로그인 상태 아니면 로그인 페이지로 이동
    router.push('/login');
  }
};
</script>

<style scoped>
/* 전체 레이아웃 */
.main {
  background-color: white;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 로고 영역 */
.logo-box {
  display: flex;
  justify-content: center;
}

.logo-box img {
  width: 300px;
  height: auto;
}

/* 첫 번째 텍스트 (영문 슬로건) */
div:nth-of-type(2) {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-top: 20px;
}

/* 두 번째 텍스트 (한글 슬로건) */
div:nth-of-type(3) {
  text-align: center;
  font-size: 16px;
  color: #333;
  margin-top: 5px;
}

/* 버튼 감싸는 영역 */
.btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/* '시작하기' 버튼 스타일 */
.start-button {
  background-color: #ffd600;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

/* 버튼 호버 시 색상 변경 */
.start-button:hover {
  background-color: #ffca00;
}
</style>
