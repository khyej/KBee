<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-4 pt-20">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
