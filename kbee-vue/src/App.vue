<<<<<<< HEAD
<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
=======
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
>>>>>>> changyoung
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
