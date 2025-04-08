<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Layout from './components/Layout.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <Layout>
    <template v-slot:header>
      <Header />
    </template>
    <template v-slot:sidebar>
      <Sidebar />
    </template>
    <template v-slot:routerview>
      <RouterView />
    </template>
  </Layout>
</template>
