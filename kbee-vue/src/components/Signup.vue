<template>
    <div class="main">
        <div class="card">
            <!-- 로고 -->
            <div class="logo-box">
                <img src="@/assets/logo.png" />
            </div>

            <!-- 프로필 이미지 선택 UI -->
            <div class="profile-img-section">
                <img :src="form.profileImage" class="selected-profile" />
                <div class="profile-options">
                    <!-- 프로필 이미지 선택 리스트 -->
                    <img v-for="n in 4" :key="n" :src="`/profile${n}.png`" :alt="`profile${n}`"
                        class="profile-option-img" :class="{ selected: form.profileImage === `/profile${n}.png` }"
                        @click="form.profileImage = `/profile${n}.png`" />
                </div>
            </div>

            <!-- 회원가입 입력 필드 -->
            <div class="input-group">
                <div class="input-row" v-for="(label, key) in fields" :key="key">
                    <label>{{ label }}</label>
                    <input v-model="form[key]"
                        :type="key === 'password' || key === 'confirmPassword' ? 'password' : 'text'"
                        :placeholder="label + '을(를) 입력해주세요'" />
                </div>
            </div>

            <!-- 가입 버튼 -->
            <div class="btn-wrapper">
                <button @click="signup" class="login-button">회원가입</button>
            </div>

            <!-- 로그인 이동 링크 -->
            <div class="signup">
                <a @click.prevent="router.push('/login')">로그인으로 돌아가기</a>
            </div>
        </div>
    </div>
</template>

<script setup>
// Vue 관련 기능 import
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 페이지 이동용 라우터
const router = useRouter()

// 회원가입 폼 데이터 상태 정의
const form = ref({
    nickname: '',         // 닉네임
    username: '',         // 이름
    email: '',            // 이메일
    password: '',         // 비밀번호
    confirmPassword: '',  // 비밀번호 확인
    phone: '',            // 전화번호
    profileImage: '/profile1.png'  // 기본 프로필 이미지 경로
})

// 입력 항목에 대한 라벨 설정 (v-for에 사용)
const fields = {
    nickname: '닉네임',
    username: '이름',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    phone: '전화번호'
}

// 회원가입 함수
const signup = async () => {
    try {
        // 비밀번호와 확인 비밀번호 불일치 체크
        if (form.value.password !== form.value.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다')
            return
        }

        // 전체 유저 목록 가져오기 (중복 체크용)
        const res = await axios.get('/api/users')
        const users = res.data

        // 중복 닉네임 또는 이메일 확인
        const isDuplicate = users.some(
            u => u.email === form.value.email || u.nickname === form.value.nickname
        )
        if (isDuplicate) {
            alert('중복된 이메일 또는 닉네임입니다')
            return
        }

        // 새로운 유저 ID 생성 (숫자 ID 기준으로 최댓값 + 1)
        const nextId = String(Math.max(...users.map(u => Number(u.id))) + 1)

        // 회원가입 정보 생성
        const newUser = {
            id: nextId,
            nickname: form.value.nickname,
            username: form.value.username,
            email: form.value.email,
            password: form.value.password,
            phone: form.value.phone,
            profileImage: form.value.profileImage, // 선택한 프로필
            budget: '0' // 초기 예산
        }

        // 유저 정보 저장 요청
        await axios.post('/api/users', newUser)

        alert('회원가입 완료!')
        router.push('/login') // 로그인 페이지로 이동
    } catch (error) {
        console.error('회원가입 실패:', error.message)
        alert('회원가입 실패: 서버 오류가 발생했습니다.')
    }
}
</script>

<style scoped>
/* 전체 배경 */
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f1f5fa;
}

/* 카드 형태의 중앙 박스 */
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

/* 로고 */
.logo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
}

.logo-box img {
    width: 200px;
    height: auto;
}

/* 🔽 프로필 이미지 선택 영역 */
.profile-img-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
}

.selected-profile {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 12px;
    border: 2px solid #ccc;
}

.profile-options {
    display: flex;
    gap: 10px;
}

.profile-option-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border 0.2s ease-in-out;
}

.profile-option-img:hover {
    border-color: #aaa;
}

.profile-option-img.selected {
    border-color: #333;
}

/* 🔼 프로필 이미지 선택 끝 */

/* 입력 필드 영역 */
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

/* 버튼 */
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

/* 로그인 페이지 이동 텍스트 */
.signup {
    text-align: center;
    font-size: 14px;
    color: #666;
}
</style>
