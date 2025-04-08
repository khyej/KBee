<script setup>
import { useRoute } from 'vue-router';
import config from '@/config';
import { computed } from 'vue';
const currentRoute = useRoute();
const currentMenu = computed(() => {
  return config.menus.find((menu) => menu.url === currentRoute.path);
});
const isActive = computed(() => {
  return currentRoute.path === currentMenu.value.url;
});
const isDefault = computed(() => {
  return currentMenu.value.title === 'default';
});
</script>

<template>
  <div class="layout">
    <header id="header">
      <slot name="header" />
    </header>
    <div class="contentBox" v-if="!isDefault">
      <slot name="sidebar" />
      <main class="mainBox"><slot /></main>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
header {
  width: 100%;
  height: 50px;
  background-color: white;
  /* border: 1px solid rgb(255, 204, 0); */
  border-bottom: 1px solid rgb(255, 204, 0);
  box-shadow: inset;
  display: flex;
  align-items: center;
}

img {
  width: 50px;
  height: 50px;
  margin: 0 10px;
}

p {
  font-family: 'S-CoreDream-3Light';
  font-weight: 900;
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
export default {
  name: 'Layout';
}
</style>
