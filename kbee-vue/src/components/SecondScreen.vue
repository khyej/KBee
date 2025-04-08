<template>
  <div>
    <h2>Second Screen</h2>
    <p>Selected Date: {{ selectedDate }}</p>
    <Income @income-loaded="handleIncomeLoaded" :selectedDate="selectedDate" />
    <Expense
      @expense-loaded="handleExpenseLoaded"
      :selectedDate="selectedDate"
    />
    <div v-if="parentIncomeList.length > 0">
      <h2>Income Data in Parent</h2>
      <ul>
        <li v-for="item in parentIncomeList" :key="item.id">
          {{ item.description }} - {{ item.amount }}
        </li>
      </ul>
    </div>
    <div v-if="parentExpenseList.length > 0">
      <h2>Expense Data in Parent</h2>
      <ul>
        <li v-for="item in parentExpenseList" :key="item.id">
          {{ item.description }} - {{ item.amount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import Income from './Income.vue';
import Expense from './Expense.vue';

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

const parentIncomeList = ref([]);
const parentExpenseList = ref([]);

const handleIncomeLoaded = (incomeData) => {
  parentIncomeList.value = incomeData;
};

const handleExpenseLoaded = (expenseData) => {
  parentExpenseList.value = expenseData;
};
</script>
