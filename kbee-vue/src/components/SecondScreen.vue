<template>
  <div>
    <h2>Second Screen</h2>
    <p>Selected Date: {{ selectedDate }}</p>
    <!-- <Income :selectedDate="selectedDate" @income-loaded="handleIncomeLoaded" /> -->
    <Income />
    <div v-if="parentIncomeList.length > 0">
      <h2>Income Data in Parent</h2>
      <ul>
        <li v-for="item in parentIncomeList" :key="item.id">
          {{ item.description }} - {{ item.amount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import Income from './Income.vue';

const props = defineProps({
  selectedDate: {
    type: String,
    required: true,
  },
});

const parentIncomeList = ref([]);

const handleIncomeLoaded = (incomeData) => {
  parentIncomeList.value = incomeData;
};
</script>
