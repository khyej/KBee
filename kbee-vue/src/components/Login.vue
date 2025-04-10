<template>
  <div class="main">
    <div class="card">
      <!-- 로고 영역 -->
      <div class="logo-box">
        <img src="@/assets/logo.png" />
      </div>

      <!-- 입력 폼 그룹 -->
      <div class="input-group">
        <!-- 이메일(ID) 입력 -->
        <div class="input-row">
          <label>ID</label>
          <input v-model="form.id" placeholder="아이디를 입력해주세요" @keyup.enter="login" />
        </div>

        <!-- 구분선 -->
        <div class="divider"></div>

        <!-- 비밀번호 입력 -->
        <div class="input-row">
          <label>PW</label>
          <input v-model="form.pw" type="password" placeholder="비밀번호를 입력해주세요" @keyup.enter="login" />
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <div class="btn-wrapper">
        <button @click="login" class="login-button">Login</button>
      </div>

      <!-- 회원가입 이동 버튼 -->
      <div class="signup">
        <button @click.prevent="router.push('/signup')">회원가입</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 기능
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// 사용자 상태 관리 (Pinia)
import { useUserStore } from '@/stores/user';

const router = useRouter(); // 페이지 이동용
const userStore = useUserStore(); // 사용자 상태 저장소

// 로그인 폼 입력값
const form = ref({
  id: '', // 이메일 (아이디)
  pw: '', // 비밀번호
});

// 로그인 처리 함수
const login = async () => {
  try {
    // 모든 사용자 목록 불러오기
    const res = await axios.get('/api/users');
    const users = res.data;

    // 이메일+비밀번호 일치 여부 확인
    const matchedUser = users.find(
      (u) => u.email === form.value.id && u.password === form.value.pw
    );

    // 로그인 성공 처리
    if (matchedUser) {
      userStore.login(matchedUser); // 사용자 상태 저장
      alert('로그인 성공');
      router.push('/dashboard'); // 대시보드로 이동
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다');
    }
  } catch (err) {
    console.error('로그인 오류:', err.message);
    alert('서버 연결에 실패했습니다');
  }
};
</script>

<style scoped>
/* 전체 화면 정렬 */
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
  height: 100vh;
  background-color: #f1f5fa;
}

/* 카드 박스 스타일 */
.card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 로고 위치 */
.logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
}

.logo-box img {
  width: 200px;
  height: auto;
}

/* 입력 박스 */
.input-group {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  margin-bottom: 70px;
}

/* 입력 행 구성 */
.input-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.input-row label {
  width: 40px;
  font-weight: 500;
  color: #555;
}

.input-row input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding-left: 8px;
  color: #333;
}

/* ID-PW 구분선 */
.divider {
  height: 1px;
  background-color: #eee;
}

/* 로그인 버튼 영역 */
.btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.login-button {
  width: 100%;
  padding: 12px 0;
  background-color: rgb(96, 88, 76);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.login-button:hover {
  background-color: rgb(66, 60, 52);
}

/* 회원가입 링크 */
.signup {
  text-align: center;
  font-size: 14px;
  color: #666;
}
</style>
