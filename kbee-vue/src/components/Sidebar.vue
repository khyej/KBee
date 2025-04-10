<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import config from '@/config';
import { useUserStore } from '@/stores/user';

const currentRoute = useRoute();
const router = useRouter();
const userStore = useUserStore();
</script>

<template>
  <aside>
    <div>
      <ul>
        <li v-for="menu in config.menus" :key="menu.url">
          <div
            :class="currentRoute.path === menu.url ? 'activeBar' : 'defaultBar'"
          ></div>
          <router-link :to="menu.url">{{ menu.title }}</router-link>
        </li>
      </ul>
    </div>

    <!-- 내 정보 영역 (사이드바 하단 고정) -->
    <div class="my-info" v-if="userStore.isLoggedIn">
      <img
        :src="userStore.user?.profileImage || '/profile1.png'"
        class="my-info-img"
        @click="router.push('/mypage')"
      />
      <p class="nickname">{{ userStore.user.nickname }}</p>
      <!-- <p>{{ userStore.fetchUser }}</p> -->
    </div>
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  top: 50px;
  left: 0;
  width: 160px;
  height: calc(100vh - 50px);
  border-right: 1px solid rgb(255, 204, 0);
  padding: 20px 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 50;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.activeBar {
  width: 10px;
  height: 40px;
  background-color: rgb(255, 204, 0);
  margin-right: 15px;
}

.defaultBar {
  width: 10px;
  height: 40px;
  background-color: rgb(96, 88, 76);
  margin-right: 15px;
}

.my-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 수평 가운데 정렬 */
  justify-content: center;
  padding: 20px 0;
  text-align: center;
}

.my-info-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  margin-bottom: 6px;
}

.nickname {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
</style>
