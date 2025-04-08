<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Layout from './components/Layout.vue';
</script>

<template>
  <Layout>
    <template v-slot:header>
      <Header />
    </template>
    <template v-slot:sidebar>
      <Sidebar />
    </template>
    <template v-slot:main>
      <RouterView />
    </template>
  </Layout>
</template>
