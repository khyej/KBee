<template>
  <div
    class="h-screen flex flex-col items-center justify-center bg-green-200 p-4"
  >
    <Income />
    <p class="text-lg font-semibold mb-4">{{ selectedDate }}</p>
    <button
      class="px-4 py-2 bg-green-500 text-white rounded"
      @click="$emit('close')"
    >
      Hide Me
    </button>
  </div>
</template>

<script setup>
import Income from './Income.vue';
defineProps({ selectedDate: String });
</script>
