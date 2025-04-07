<template>
  <div class="p-6 flex justify-center">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <div class="flex justify-center mb-4">
        <div
          class="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center text-3xl"
        >
          👤
        </div>
      </div>

      <table class="w-full text-left border">
        <tr class="border-b">
          <th class="p-2 w-1/3">닉네임</th>
          <td class="p-2">
            <input
              v-if="editMode"
              v-model="form.username"
              class="border p-1 w-full"
            />
            <span v-else>{{ user.username }}</span>
          </td>
        </tr>
        <tr class="border-b">
          <th class="p-2">이름</th>
          <td class="p-2">
            <input
              v-if="editMode"
              v-model="form.name"
              class="border p-1 w-full"
            />
            <span v-else>{{ user.name }}</span>
          </td>
        </tr>
        <tr class="border-b">
          <th class="p-2">이메일</th>
          <td class="p-2">
            <input
              v-if="editMode"
              v-model="form.email"
              class="border p-1 w-full"
            />
            <span v-else>{{ user.email }}</span>
          </td>
        </tr>
        <tr>
          <th class="p-2">연락처</th>
          <td class="p-2">
            <input
              v-if="editMode"
              v-model="form.phone"
              class="border p-1 w-full"
            />
            <span v-else>{{ user.phone }}</span>
          </td>
        </tr>
      </table>

      <div class="text-right mt-4">
        <button
          @click="toggleEdit"
          class="px-4 py-2 bg-yellow-400 text-white rounded"
        >
          {{ editMode ? '저장' : '수정' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userId = 1; // 현재 로그인된 유저 ID (고정)
const user = ref({});
const form = ref({});
const editMode = ref(false);

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3001/user`);
  user.value = res.data;
  form.value = {
    username: res.data.username,
    name: res.data.name || '',
    email: res.data.email || '',
    phone: res.data.phone || '',
  };
};

const toggleEdit = async () => {
  if (editMode.value) {
    // 저장
    await axios.put(`http://localhost:3001/user`, {
      ...user.value,
      ...form.value,
    });
    await fetchUser();
  }
  editMode.value = !editMode.value;
};

onMounted(fetchUser);
</script>
