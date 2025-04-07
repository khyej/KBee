<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/income">Income</RouterLink>
      <RouterLink to="/expense">Expense</RouterLink>
      <RouterLink to="/stats">Stats</RouterLink>
      <RouterLink to="/history">History</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/logout">Logout</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
