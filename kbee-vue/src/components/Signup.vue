<template>
    <div class="min-h-screen flex items-center justify-center bg-[#f0f5fa]">
        <div class="bg-white p-8 rounded-xl border-2 border-blue-500 w-80 shadow-md text-center">
            <img src="@/assets/kbee-logo.png" alt="KBee Logo" class="w-16 h-16 mx-auto mb-4" />
            <h1 class="text-xl font-semibold mb-6">KBee</h1>

            <div class="space-y-3 mb-4 text-left">
                <div>
                    <label class="text-sm font-semibold">ID</label>
                    <input type="text" placeholder="아이디를 입력해주세요" class="mt-1 w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                    <label class="text-sm font-semibold">PW</label>
                    <input type="password" placeholder="비밀번호를 입력해주세요"
                        class="mt-1 w-full border rounded px-3 py-2 text-sm" />
                </div>
            </div>

            <button class="w-full bg-[#5d5145] text-white py-2 rounded font-bold">Login</button>
            <p class="text-xs mt-2 text-gray-500 cursor-pointer hover:underline">회원가입</p>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'

const form = reactive({
    nickname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
})

const handleRegister = async () => {
    const res = await axios.post('http://localhost:3001/users')
    const users = res.data

    // 중복체크
    const isEmailDuplicate = users.some(u => u.email === form.email)
    const isNicknameDuplicate = users.some(u => u.nickname === form.nickname)

    if (isEmailDuplicate) {
        alert('이미 존재하는 이메일입니다.')
        return
    }
    if (isNicknameDuplicate) {
        alert('이미 존재하는 닉네임입니다.')
        return
    }
    if (form.password !== form.confirmPassword) {
        alert('비밀번호가 일치 하지 않습니다.')
    }

    //ID 자동 증가(문자열로)
    const nexId = String(Math.max(...users.map(u => Number(u.id))) + 1)

    const newUser = {
        id: nexId,
        ...form
    }

    await axios.post('http://localhost:3001/users', newUser)
    alert('회원가입 되었습니다')
}
</script>