<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { RouterView } from 'vue-router';
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
    <div class="contentBox">
      <RouterView />
    </div>
  </Layout>
</template>

<style></style>
