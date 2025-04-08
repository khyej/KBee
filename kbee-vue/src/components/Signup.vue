<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
    nickname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
})

const fields = {
    nickname: '닉네임',
    username: '이름',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    phone: '전화번호'
}

const signup = async () => {
    try {
        if (form.value.password !== form.value.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다')
            return
        }

        const res = await axios.get('http://localhost:3001/users')
        const users = res.data

        const isDuplicate = users.some(
            u => u.email === form.value.email || u.nickname === form.value.nickname
        )
        if (isDuplicate) {
            alert('중복된 이메일 또는 닉네임입니다')
            return
        }

        const nextId = String(Math.max(...users.map(u => Number(u.id))) + 1)

        const newUser = {
            id: nextId,
            nickname: form.value.nickname,
            username: form.value.username,
            email: form.value.email,
            password: form.value.password,
            phone: form.value.phone,
            budget: ''
        }

        await axios.post('http://localhost:3001/users', newUser)
        alert('회원가입 완료!')
        router.push('/login')
    } catch (error) {
        console.error('회원가입 실패:', error.message)
        alert('회원가입 실패: 서버 오류가 발생했습니다.')
    }
}
</script>


<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
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
    margin-bottom: 40px;
}

.input-row {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
}

.input-row:last-child {
    border-bottom: none;
}

.input-row label {
    width: 90px;
    font-weight: 500;
    color: #555;
    font-size: 14px;
}

.input-row input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    padding-left: 8px;
    color: #333;
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
<template>
    <div class="main">
        <div class="card">
            <div class="logo-box">
                <img src="@/assets/logo.png" />
            </div>

            <div class="input-group">
                <div class="input-row" v-for="(label, key) in fields" :key="key">
                    <label>{{ label }}</label>
                    <input v-model="form[key]" :type="key.includes('password') ? 'password' : 'text'"
                        :placeholder="label + '을(를) 입력해주세요'" />
                </div>
            </div>

            <div class="btn-wrapper">
                <button @click="signup" class="login-button">회원가입</button>
            </div>

            <div class="signup">
                <a @click.prevent="router.push('/login')">로그인으로 돌아가기</a>
            </div>
        </div>
    </div>
</template>