<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
<template>
  <aside class="bg-white text-black p-4 border-3 border-amber-300 mt-16">
    <div class="overflow-y-auto py-4 px-3 bg-white rounded dark:bg-gray-800 h-screen">
      <ul class="space-y-6">
        <li class="flex items-center">
          <span class="w-2 h-11 bg-amber-300 mr-3"></span>
          <RouterLink to="/logout"
            class="flex items-center p-2 text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-current="page">대시 보드</RouterLink>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-11 bg-gray-700 mr-3"></span>
          <RouterLink to="/home" class="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">달력
          </RouterLink>
        </li>

        <li class="flex items-center">
          <span class="w-2 h-11 bg-gray-700 mr-3"></span>
          <RouterLink to="/stats" class="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Stats
          </RouterLink>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-11 bg-gray-700 mr-3"></span>
          <RouterLink to="/history" class="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">목록
          </RouterLink>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-11 bg-gray-700 mr-3"></span>
          <RouterLink to="/login" class="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Login
          </RouterLink>
        </li>
        <li class="flex items-center">
          <span class="w-2 h-11 bg-gray-700 mr-3"></span>
          <RouterLink to="/mypage" class="text-black dark:text-whitehover:bg-gray-100 dark:hover:bg-gray-700">내정보
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
<style scoped>
/* .bar {
  @apply w-2 h-11 mr-3;
} */
</style>
