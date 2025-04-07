<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Sidebar from './Sidebar.vue';
</script>
<template>
  <header class="bg-gray-800 text-white p-4 fixed top-0 w-full shadow-md">
    <div class="max-w-screen-xl px-4 py-3 mx-auto">
      <div class="flex items-center">
        <ul
          class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm"
        >
          <li>
            <RouterLink
              to="/logout"
              class="text-gray-900 dark:text-white hover:underline"
              aria-current="page"
              >Logout</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/income"
              class="text-gray-900 dark:text-white hover:underline"
              >Income</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/expense"
              class="text-gray-900 dark:text-white hover:underline"
              >Expense</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/stats"
              class="text-gray-900 dark:text-white hover:underline"
              >Stats</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/history"
              class="text-gray-900 dark:text-white hover:underline"
              >History</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/login"
              class="text-gray-900 dark:text-white hover:underline"
              >Login</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/"
              class="text-gray-900 dark:text-white hover:underline"
              >Home</RouterLink
            >
          </li>
          <li>
            여기는 로그인 유무에 따라 v-if 사용해서 로그인 로그아웃 처리할거임
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
