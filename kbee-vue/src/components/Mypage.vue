<template>
  <main class="main">
    <div class="card">
      <div class="icon-box">
        <i class="fa-solid fa-circle-user user-icon"></i>
      </div>
      <table class="info-table">
        <tbody>
          <tr>
            <th>닉네임</th>
            <td>
              <input
                v-if="editMode"
                v-model="form.username"
                class="border p-1 w-full"
              />
              <span v-else>{{ user.username }}</span>
            </td>
          </tr>
          <tr>
            <th>이름</th>
            <td>
              <input
                v-if="editMode"
                v-model="form.name"
                class="border p-1 w-full"
              />
              <span v-else>{{ user.name }}</span>
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>
              <input
                v-if="editMode"
                v-model="form.email"
                class="border p-1 w-full"
              />
              <span v-else>{{ user.email }}</span>
            </td>
          </tr>
          <tr>
            <th>연락처</th>
            <td>
              <input
                v-if="editMode"
                v-model="form.phone"
                class="border p-1 w-full"
              />
              <span v-else>{{ user.phone }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn-wrapper">
        <button
          @click="toggleEdit"
          class="px-4 py-2 bg-yellow-400 text-white rounded"
        >
          {{ editMode ? '저장' : '수정' }}
        </button>
      </div>
    </div>
  </main>
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

<style scoped>
@font-face {
  font-family: 'S-CoreDream-3Light';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}

main {
  font-family: 'S-CoreDream-3Light';
}

.container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
}

.main {
  flex: 1;
  background-color: #f4f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background-color: white;
  width: 500px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-box {
  text-align: center;
  margin-bottom: 24px;
}

.user-icon {
  font-size: 60px;
  color: #444;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 16px;
}

.info-table th,
.info-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.info-table th {
  background-color: #f8f8f8;
  width: 30%;
}

.btn-wrapper {
  text-align: right;
}

.edit-button {
  padding: 8px 16px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>
