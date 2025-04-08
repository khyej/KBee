<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { RouterView, useRoute } from 'vue-router';

import { onMounted } from 'vue';
import { useUserStore } from './stores/user';

const route = useRoute();
const userStore = useUserStore();

onMounted(() => {
    userStore.restoreUser();
});

// 헤더, 사이드바를 제외할 경로 리스트
const noLayoutPages = ['/', '/login'];
</script>

<template>
    <div class="layout">
        <Header v-if="!noLayoutPages.includes(route.path)" />
        <div class="contentBox">
            <Sidebar v-if="!noLayoutPages.includes(route.path)" />
            <main
                class="mainBox"
                :class="{ fullPage: noLayoutPages.includes(route.path) }"
            >
                <RouterView />
            </main>
        </div>
    </div>
</template>

<style>
@font-face {
    font-family: 'S-CoreDream-3Light';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff')
        format('woff');
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
    /* flex: 1; */
}

.mainBox {
    margin-top: 50px;
    /* 헤더 높이 */
    margin-left: 160px;
    /* 사이드바 너비 */
    width: calc(100% - 160px);
    height: calc(100vh - 50px);
    overflow-y: auto;
    padding: 20px;
    background-color: #f0f4f9;
}

.fullPage {
    margin: 0;
    width: 100%;
    height: 100vh;
}
</style>
