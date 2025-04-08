<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Layout from './components/Layout.vue';
</script>

<template>
  <Layout>
    <template #header>
      <Header />
    </template>
    <template #sidebar>
      <Sidebar />
    </template>
  </Layout>
  <router-view></router-view>
</template>
<style scoped></style>
