<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <!-- <RouterView />  -->
  <div class="flex-1">
    <Header />
    <div class="flex flex grow">
      <Sidebar>
        <RouterView />
      </Sidebar>
    </div>
  </div>
</template>
<style scoped></style>
