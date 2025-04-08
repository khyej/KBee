<script setup>
import { RouterLink, useRoute } from 'vue-router';
import config from '@/config';

const currentRoute = useRoute();
</script>
<template>
  <aside>
    <div>
      <ul>
        <li v-for="menu in config.menus">
          <div
            :class="currentRoute.path === menu.url ? 'activeBar' : 'defaultBar'"
          ></div>
          <router-link :to="menu.url">{{ menu.title }}</router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
<style scoped>
aside {
  border-right: 1px solid rgb(255, 204, 0);
  height: calc(100vh - 50px);
  width: 160px;
  padding: 20px 10px;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.activeBar {
  width: 10px;
  height: 40px;
  background-color: rgb(255, 204, 0);
  margin-right: 15px;
}

.defaultBar {
  width: 10px;
  height: 40px;
  background-color: rgb(96, 88, 76);
  margin-right: 15px;
}
</style>
