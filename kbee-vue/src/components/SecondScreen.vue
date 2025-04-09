<template>
  <div>
    <h2>Second Screen</h2>
    <h1 class="text-2xl font-bold">User ID: {{ userStore.user?.id }}</h1>
    <p>Selected Date: {{ selectedDate }}</p>
    <Income @income-loaded="handleIncomeLoaded" :selectedDate="selectedDate" />
    <Expense
      @expense-loaded="handleExpenseLoaded"
      :selectedDate="selectedDate"
    />
    <div v-if="filteredParentIncomeList.length > 0">
      <h2>Income Data in Parent</h2>
      <ul>
        <li v-for="item in filteredParentIncomeList" :key="item.id">
          {{ item.description }} - {{ item.amount }}
        </li>
      </ul>
    </div>
    <div v-if="filteredParentExpenseList.length > 0">
      <h2>Expense Data in Parent</h2>
      <ul>
        <li v-for="item in filteredParentExpenseList" :key="item.id">
          {{ item.description }} - {{ item.amount }}
        </li>
      </ul>
    </div>
    <div
      v-if="
        !filteredParentIncomeList.length && !filteredParentExpenseList.length
      "
    >
      <p>No data available for this user.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import Income from './Income.vue';
import Expense from './Expense.vue';
import { useUserStore } from '../stores/user';
import Hiya from './Hiya.vue';

const userStore = useUserStore();

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

const filteredParentIncomeList = computed(() => {
  if (!userStore.user?.id) {
    return [];
  }
  return parentIncomeList.value.filter(
    (item) => item.user_id === userStore.user.id
  );
});

const filteredParentExpenseList = computed(() => {
  if (!userStore.user?.id) {
    return [];
  }
  return parentExpenseList.value.filter(
    (item) => item.user_id === userStore.user.id
  );
});
</script>
