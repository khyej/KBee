<template>
  <div>
    <!-- 상단 내비게이션 -->
    <header class="bg-white shadow p-4">
      <nav class="max-w-screen-xl mx-auto flex space-x-6">
        <RouterLink to="/" class="text-gray-700 hover:text-blue-500"
          >Home</RouterLink
        >
        <RouterLink to="/income" class="text-gray-700 hover:text-blue-500"
          >Income</RouterLink
        >
        <RouterLink to="/expense" class="text-gray-700 hover:text-blue-500"
          >Expense</RouterLink
        >
        <RouterLink to="/stats" class="text-gray-700 hover:text-blue-500"
          >Stats</RouterLink
        >
        <RouterLink to="/history" class="text-gray-700 hover:text-blue-500"
          >History</RouterLink
        >
        <RouterLink to="/login" class="text-gray-700 hover:text-blue-500"
          >Login</RouterLink
        >
        <RouterLink to="/logout" class="text-gray-700 hover:text-blue-500"
          >Logout</RouterLink
        >
      </nav>
    </header>

    <!-- 페이지 컴포넌트 -->
    <main class="max-w-screen-xl mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
