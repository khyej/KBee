<template>
  <div>
    <!-- Buttons to change the mode -->
    <button @click="mode = 'all'">All (Daily/Individual)</button>
    <button @click="mode = 'income'">Income (Daily/Individual)</button>
    <button @click="mode = 'expense'">Expense (Daily/Individual)</button>
    <button @click="mode = 'monthly'">Monthly Summary</button>
    <!-- New Mode -->

    <!-- Display the filtered list (Daily/Individual) -->
    <ul v-if="mode !== 'monthly'">
      <li v-for="item in filteredList" :key="item.id + '-' + item.type">
        {{ item.type }}: {{ item.description }} - {{ item.amount }} (ID:
        {{ item.id }})
      </li>
    </ul>

    <!-- Display Monthly Data -->
    <div v-if="mode === 'monthly'">
      <h3>Monthly Income Summary ({{ currentYear }})</h3>
      <ul v-if="transactionStore.incomeMonthList.length > 0">
        <li
          v-for="(item, index) in transactionStore.incomeMonthList"
          :key="'inc-month-' + index"
        >
          <!-- Adjust based on your monthly data structure -->
          Month: {{ item.month }} - Total:
          {{ item.totalAmount?.toLocaleString() || 'N/A' }}
        </li>
      </ul>
      <p v-else>No monthly income data for {{ currentYear }}.</p>

      <h3 class="mt-4">Monthly Expense Summary ({{ currentYear }})</h3>
      <ul v-if="transactionStore.expenseMonthList.length > 0">
        <li
          v-for="(item, index) in transactionStore.expenseMonthList"
          :key="'exp-month-' + index"
        >
          <!-- Adjust based on your monthly data structure -->
          Month: {{ item.month }} - Total:
          {{ item.totalAmount?.toLocaleString() || 'N/A' }}
        </li>
      </ul>
      <p v-else>No monthly expense data for {{ currentYear }}.</p>
    </div>

    <!-- Loading/Error States -->
    <p
      v-if="
        transactionStore.isIncomeLoading || transactionStore.isExpenseLoading
      "
    >
      Loading...
    </p>
    <!-- Display specific errors if needed -->
    <p v-if="transactionStore.incomeError && mode !== 'expense'">
      <!-- Show income error unless only showing expenses -->
      Income Error: {{ transactionStore.incomeError }}
    </p>
    <p v-if="transactionStore.expenseError && mode !== 'income'">
      <!-- Show expense error unless only showing income -->
      Expense Error: {{ transactionStore.expenseError }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Import onMounted
import { useTransactionStore } from '@/stores/TransactionStore'; // Adjust path if needed

const transactionStore = useTransactionStore();

// --- Component-specific state ---
const mode = ref('all'); // 'all', 'income', 'expense', 'monthly'
const currentYear = new Date().getFullYear(); // Get the current year for fetching monthly data

// --- Fetch Data ---
onMounted(async () => {
  // Fetch individual transactions (if not already handled elsewhere)
  // You might keep this if Hiya is independent, or remove if Calendar/History always fetches first
  // await transactionStore.fetchAllUserTransactions(); // Optional: fetch daily/all if needed here

  // Fetch monthly data for the current year
  console.log(`Hiya: Fetching monthly data for ${currentYear}`);
  await Promise.all([
    transactionStore.fetchMonthlyIncome(currentYear),
    transactionStore.fetchMonthlyExpense(currentYear),
  ]);
});

// --- Sorting function (example: sort by ID) ---
const byId = (a, b) => a.id - b.id; // Or sort by date, amount, etc.

// --- Computed property for display (Daily/Individual) ---
const filteredList = computed(() => {
  // Ensure store lists are arrays before mapping
  const incomes = Array.isArray(transactionStore.incomeList)
    ? transactionStore.incomeList
    : [];
  const expenses = Array.isArray(transactionStore.expenseList)
    ? transactionStore.expenseList
    : [];

  const incomesWithType = incomes.map((i) => ({
    ...i,
    type: 'income',
  }));
  const expensesWithType = expenses.map((e) => ({
    ...e,
    type: 'expense',
  }));

  if (mode.value === 'income') {
    // Use slice() to create a copy before sorting, preventing mutation of original computed array if needed elsewhere
    return incomesWithType.slice().sort(byId);
  }
  if (mode.value === 'expense') {
    return expensesWithType.slice().sort(byId);
  }
  // Default 'all' mode
  return [...incomesWithType, ...expensesWithType].sort(byId);
});
</script>

<style scoped>
/* Add some basic styling for buttons and margin */
button {
  margin-right: 8px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #eee;
}
.mt-4 {
  margin-top: 1rem; /* 16px */
}
</style>
