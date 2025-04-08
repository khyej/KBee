<template>
  <div class="main">
    <div class="card">
      <div class="logo-box">
        <img src="@/assets/logo.png" />
      </div>

      <div class="input-group">
        <div class="input-row">
          <label>ID</label>
          <input
            v-model="form.id"
            placeholder="아이디를 입력해주세요"
            @keyup.enter="login"
          />
        </div>
        <div class="divider"></div>
        <div class="input-row">
          <label>PW</label>
          <input
            v-model="form.pw"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            @keyup.enter="login"
          />
        </div>
      </div>

      <div class="btn-wrapper">
        <button @click="login" class="login-button">Login</button>
      </div>

      <div class="signup">
        <a @click.prevent="router.push('/signup')">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  id: '', // 이메일
  pw: '', // 비밀번호
});

const login = async () => {
  try {
    const res = await axios.get('/api/users');
    const users = res.data;

    const matchedUser = users.find(
      (u) => u.email === form.value.id && u.password === form.value.pw
    );

    if (matchedUser) {
      userStore.login(matchedUser); // Pinia 등에서 로그인 처리
      alert('로그인 성공');
      router.push('/dashboard');
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
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
  height: 100vh;
  background-color: #f1f5fa;
}

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

.input-group {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  margin-bottom: 70px;
}

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

.divider {
  height: 1px;
  background-color: #eee;
}

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

.signup {
  text-align: center;
  font-size: 14px;
  color: #666;
}
</style>
