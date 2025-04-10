<template>
  <main class="main">
    <div class="card">
      <div class="icon-box">
        <!-- 반응형 프로필 이미지 표시 -->
        <img :src="editMode
          ? (form.profileImage || '/profile1.png')
          : (userStore.user?.profileImage || '/profile1.png')" class="profile-img" alt="프로필 이미지" />

        <!-- 프로필 이미지 선택 옵션 (편집 모드에서만 보이게) -->
        <div v-if="editMode" class="profile-options">
          <img v-for="n in 4" :key="n" :src="`/profile${n}.png`" :alt="`profile${n}`" class="profile-option-img"
            :class="{ selected: form.profileImage === `/profile${n}.png` }"
            @click="form.profileImage = `/profile${n}.png`" />
        </div>
      </div>

      <table class="info-table">
        <tbody>
          <tr>
            <th>닉네임</th>
            <td>
              <input v-if="editMode" v-model="form.nickname" class="input-field" />
              <span v-else>{{ userStore.user?.nickname }}</span>
            </td>
          </tr>
          <tr>
            <th>이름</th>
            <td>
              <input v-if="editMode" v-model="form.username" class="input-field" />
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
          <tr>
            <th>예산</th>
            <td>
              <input v-if="editMode" v-model="form.budget" class="input-field" />
              <span v-else>{{ userStore.user?.budget }}</span>
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
  try {
    await userStore.fetchUser();
    form.value = {
      ...userStore.user,
      profileImage: userStore.user?.profileImage || ''
    };
  } catch (err) {
    console.error('유저 정보 불러오기 실패:', err);
  }
});

watch(
  () => userStore.user,
  (newVal) => {
    if (newVal) {
      form.value = {
        ...newVal,
        profileImage: newVal.profileImage || ''
      };
    }
  }
);

const toggleEdit = async () => {
  if (editMode.value) {
    try {
      await userStore.updateUser(form.value);
    } catch (err) {
      console.error('유저 정보 업데이트 실패:', err);
      return;
    }
  }
  editMode.value = !editMode.value;
};
</script>

<style scoped>
@font-face {
  font-family: 'S-CoreDream-3Light';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
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
  margin-top: 150px;
  align-items: center;
}

.card {
  background-color: white;
  width: 500px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.profile-options {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.profile-option-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s ease-in-out;
}

.profile-option-img:hover {
  border-color: #ffc107;
}

.profile-option-img.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px #007bff;
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
