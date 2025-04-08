<template>
  <main class="main">
    <div class="card">
      <div class="icon-box">
        <i class="user-icon fa-solid fa-circle-user"></i>
      </div>
      <table class="info-table">
        <tbody>
          <tr>
            <th>닉네임</th>
            <td>
              <input
                v-if="editMode"
                v-model="form.nickname"
                class="input-field"
              />
              <span v-else>{{ userStore.user?.nickname }}</span>
            </td>
          </tr>
          <tr>
            <th>이름</th>
            <td>
              <input
                v-if="editMode"
                v-model="form.username"
                class="input-field"
              />
              <span v-else>{{ userStore.user?.username }}</span>
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>
              <input v-if="editMode" v-model="form.email" class="input-field" />
              <span v-else>{{ userStore.user?.email }}</span>
            </td>
          </tr>
          <tr>
            <th>연락처</th>
            <td>
              <input v-if="editMode" v-model="form.phone" class="input-field" />
              <span v-else>{{ userStore.user?.phone }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn-wrapper">
        <button @click="toggleEdit" class="edit-button">
          {{ editMode ? '저장' : '수정' }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const form = ref({});
const editMode = ref(false);

onMounted(async () => {
  await userStore.fetchUser();
  form.value = { ...userStore.user }; // 초기값 복사
});

// userStore.user가 바뀌면 form도 같이 바뀌게
watch(
  () => userStore.user,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  }
);

const toggleEdit = async () => {
  if (editMode.value) {
    await userStore.updateUser(form.value);
  }
  editMode.value = !editMode.value;
};
</script>

<style scoped>
@font-face {
  font-family: 'S-CoreDream-3Light';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'S-CoreDream-3Light';
  box-sizing: border-box;
}

.main {
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fb;
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

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-wrapper {
  text-align: right;
}

.edit-button {
  padding: 10px 20px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.edit-button:hover {
  background-color: #e0a800;
}
</style>
