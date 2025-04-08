<script setup>
// You can add any necessary logic here, like isDefault
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="layout">
    <header id="header">
      <slot name="header" />
    </header>
    <div class="contentBox" v-if="!isDefault">
      <slot name="sidebar" />
    </div>

    <div class="mainBox">
      <!-- <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view> -->
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
header {
  width: 100%;
  height: 50px;
  background-color: white;
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
</style>
