<template>
  <div class="main">
    <div class="logo-box">
      <img src="@/assets/logo.png" />
    </div>
    <div>Keep Budget every entry</div>
    <div>매일 예산 관리하는 습관</div>
    <div class="btn-wrapper">
      <button @click="start" class="start-button">시작하기</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'; // 사용자 정보 접근

const router = useRouter();
const userStore = useUserStore(); // Pinia store

const start = () => {
  if (userStore.isLoggedIn) {
    router.push('/dashboard'); // 로그인되어 있으면 대시보드(또는 홈)
  } else {
    router.push('/login'); // 로그인 안 됐으면 로그인 화면
  }
};
</script>

<style scoped>
.main {
  background-color: white;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-box {
  display: flex;
  justify-content: center;
}

.logo-box img {
  width: 300px;
  height: auto;
}

div:nth-of-type(2) {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-top: 20px;
}

div:nth-of-type(3) {
  text-align: center;
  font-size: 16px;
  color: #333;
  margin-top: 5px;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

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

.start-button:hover {
  background-color: #ffca00;
}
</style>
