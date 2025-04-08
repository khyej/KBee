<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="layout">
    <Header />
    <div class="contentBox">
      <Sidebar />
      <main class="mainBox">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: 'S-CoreDream-3Light';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'S-CoreDream-3Light';
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contentBox {
  display: flex;
  flex: 1;
}

.mainBox {
  flex: 1;
  padding: 5px;
  box-sizing: border-box;
}
</style>
