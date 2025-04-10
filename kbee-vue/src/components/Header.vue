<script setup>
// 라우터 관련 기능 사용 (라우팅 링크, 뷰 전환)
import { RouterLink, RouterView } from 'vue-router';
// 사이드바 컴포넌트 (현재 이 파일에서는 사용되지 않음)
import Sidebar from './Sidebar.vue';

// 사용자 상태를 관리하는 Pinia store
import { useUserStore } from '@/stores/user';
// 페이지 이동을 위한 router 사용
import { useRouter } from 'vue-router';

// userStore: 로그인 상태 및 유저 정보 저장
const userStore = useUserStore();
// router: 페이지 이동을 위한 라우터 인스턴스
const router = useRouter();

// 로그아웃 함수: 사용자 로그아웃 후 홈 화면('/')으로 이동
const logout = () => {
  userStore.logout();   // store의 logout() 메서드 호출
  router.push('/');     // '/' 경로로 리디렉션
};
</script>

<template>
  <!-- 상단 헤더 영역 -->
  <header>
    <!-- 로고 이미지 -->
    <img src="@/assets/logo.png" />
    <!-- 제목 텍스트 -->
    <p>가계부</p>

    <!-- 로그인된 경우에만 로그아웃 버튼 표시 -->
    <div class="header-right" v-if="userStore.isLoggedIn">
      <button @click="logout">로그아웃</button>
    </div>
  </header>

  <!-- 아래는 주석 처리된 예전 버전의 header 코드로, 네비게이션 메뉴가 포함됨 -->
  <!-- 향후 로그인 여부에 따라 메뉴 구성을 동적으로 보여주기 위해 참고 가능 -->
  <!-- 
  <header class="bg-white dark:bg-gray-800 text-black dark:text-white p-4 fixed top-0 w-full shadow-md border-1 border-[#FFBC00]">
    <div class="max-w-screen-xl px-4 py-3 mx-auto">
      <div class="flex items-center">
        <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
          <li>
            <RouterLink to="/logout" class="text-gray-900 dark:text-white hover:underline">Logout</RouterLink>
          </li>
          <li>
            <RouterLink to="/income" class="text-gray-900 dark:text-white hover:underline">Income</RouterLink>
          </li>
          <li>
            <RouterLink to="/expense" class="text-gray-900 dark:text-white hover:underline">Expense</RouterLink>
          </li>
          <li>
            <RouterLink to="/stats" class="text-gray-900 dark:text-white hover:underline">Stats</RouterLink>
          </li>
          <li>
            <RouterLink to="/history" class="text-gray-900 dark:text-white hover:underline">History</RouterLink>
          </li>
          <li>
            <RouterLink to="/login" class="text-gray-900 dark:text-white hover:underline">Login</RouterLink>
          </li>
          <li>
            <RouterLink to="/" class="text-gray-900 dark:text-white hover:underline">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/mypage" class="text-gray-900 dark:text-white hover:underline">Mypage</RouterLink>
          </li>
          <li>
            여기는 로그인 유무에 따라 v-if 사용해서 로그인 로그아웃 처리할거임
          </li>
        </ul>
      </div>
    </div>
  </header> 
  -->
</template>

<style scoped>
/* 헤더 전체 영역 스타일 */
header {
  position: fixed;
  /* 화면 상단 고정 */
  width: 100%;
  /* 전체 너비 */
  height: 50px;
  /* 높이 */
  background-color: white;
  /* 배경 흰색 */
  border-bottom: 1px solid rgb(255, 204, 0);
  /* 하단 노란색 테두리 */
  box-shadow: inset;
  /* 내부 그림자 효과 */
  display: flex;
  /* Flexbox로 정렬 */
  align-items: center;
  /* 세로 가운데 정렬 */
  justify-content: space-between;
  /* 좌우 정렬 */
  padding: 0 16px;
  /* 좌우 패딩 */
}

/* 로고 이미지 스타일 */
img {
  width: 50px;
  height: 50px;
  margin: 0 10px;
}

/* 제목 텍스트 스타일 */
p {
  font-family: 'S-CoreDream-3Light';
  /* 지정된 글꼴 사용 */
  font-weight: 900;
  /* 굵게 표시 */
}

/* 로그아웃 버튼이 있는 오른쪽 영역 스타일 */
.header-right button {
  background-color: #ffd600;
  /* 노란색 배경 */
  color: white;
  /* 텍스트 흰색 */
  font-weight: bold;
  /* 굵은 글씨 */
  border: none;
  /* 테두리 없음 */
  padding: 6px 12px;
  /* 여백 */
  border-radius: 4px;
  /* 둥근 모서리 */
  cursor: pointer;
  /* 포인터 커서 */
}

/* 버튼에 마우스를 올렸을 때 색상 변화 */
.header-right button:hover {
  background-color: #ffca00;
  /* 더 진한 노란색으로 변경 */
}
</style>
