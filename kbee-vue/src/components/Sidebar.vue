<template>
  <aside>
    <div>
      <ul>
        <!-- 메뉴 리스트 루프 -->
        <li v-for="menu in config.menus" :key="menu.url">
          <!-- 현재 경로와 일치하면 활성 바 표시 -->
          <div :class="currentRoute.path === menu.url ? 'activeBar' : 'defaultBar'"></div>
          <!-- 메뉴 링크 -->
          <router-link :to="menu.url">{{ menu.title }}</router-link>
        </li>
      </ul>
    </div>

    <!-- 사용자 정보 (로그인 상태일 때만 표시) -->
    <div class="my-info" v-if="userStore.isLoggedIn">
      <!-- 프로필 이미지 (없으면 기본 이미지 사용), 클릭 시 마이페이지 이동 -->
      <img :src="userStore.user?.profileImage || '/profile1.png'" class="my-info-img" @click="router.push('/mypage')" />
      <!-- 닉네임 출력 -->
      <p class="nickname">{{ userStore.user.nickname }}</p>
      <!-- 디버깅용 fetchUser 출력 (비활성화 상태) -->
      <!-- <p>{{ userStore.fetchUser }}</p> -->
    </div>
  </aside>
</template>

<script setup>
// 라우터 기능 import
import { RouterLink, useRoute, useRouter } from 'vue-router';

// 메뉴 목록 설정값 (config.menus에서 사용)
import config from '@/config';

// 사용자 정보 store
import { useUserStore } from '@/stores/user';

// 현재 페이지 경로 정보
const currentRoute = useRoute();
// 라우터 이동용 객체
const router = useRouter();
// 사용자 상태 정보 접근
const userStore = useUserStore();
</script>

<style scoped>
/* 사이드바 전체 설정 */
aside {
  position: fixed;
  top: 50px;
  /* 상단 헤더 높이 고려 */
  left: 0;
  width: 160px;
  height: calc(100vh - 50px);
  /* 전체 높이에서 헤더 제외 */
  border-right: 1px solid rgb(255, 204, 0);
  /* 노란색 테두리 */
  padding: 20px 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* 메뉴 + 내정보를 위아래로 분리 */
  z-index: 50;
  /* 다른 요소보다 위에 보이도록 */
}

/* 메뉴 리스트 */
ul {
  list-style: none;
  padding: 0;
}

/* 각 메뉴 항목 */
li {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

/* 현재 경로일 경우 강조 바 */
.activeBar {
  width: 10px;
  height: 40px;
  background-color: rgb(255, 204, 0);
  /* 노란색 */
  margin-right: 15px;
}

/* 기본 바 (비활성 메뉴일 경우) */
.defaultBar {
  width: 10px;
  height: 40px;
  background-color: rgb(96, 88, 76);
  /* 진한 회색 */
  margin-right: 15px;
}

/* 사용자 정보 영역 */
.my-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  text-align: center;
}

/* 프로필 이미지 */
.my-info-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  margin-bottom: 6px;
}

/* 닉네임 스타일 */
.nickname {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
</style>
