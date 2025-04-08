<template>
  <div class="layout">
    <slot name="header" />
    <div class="contentBox">
      <slot name="sidebar" />
      <main class="mainBox"><slot /></main>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
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
