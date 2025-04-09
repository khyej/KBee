// stores/TransactionStore.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
// Assuming you still use the user store to get the user ID
import { useUserStore } from './user';

export const useTransactionStore = defineStore('transactions', () => {
  const userStore = useUserStore();
  const incomeList = ref([]);
  const expenseList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // State for Daily Sums Cache
  const dailyIncomeSums = ref({}); // Key: 'YYYY-MM-DD', Value: Number
  const dailyExpenseSums = ref({}); // Key: 'YYYY-MM-DD', Value: Number

  // --- Action to Fetch and Calculate Sums for a Specific Date ---
  async function fetchAndCalculateSumsForDate(dateString) {
    if (!userStore.user?.id || !dateString) return;

    // Reset sums for the date initially
    dailyIncomeSums.value[dateString] = 0;
    dailyExpenseSums.value[dateString] = 0;

    try {
      error.value = null;

      // --- START: Replace with your API call logic ---
      // Example using fetch:
      const userId = userStore.user.id;
      const incomeResponse = await fetch(
        `/api/income?userId=${userId}&date=${dateString}`
      );
      if (!incomeResponse.ok) throw new Error('Failed to fetch income');
      const incomeData = await incomeResponse.json(); // Assuming API returns [{ amount: ... }, ...]

      const expenseResponse = await fetch(
        `/api/expenses?userId=${userId}&date=${dateString}`
      );
      if (!expenseResponse.ok) throw new Error('Failed to fetch expenses');
      const expenseData = await expenseResponse.json(); // Assuming API returns [{ amount: ... }, ...]
      // --- END: Replace with your API call logic ---

      // Calculate Income Sum (Keep this part)
      const totalIncome = (incomeData || []).reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      dailyIncomeSums.value[dateString] = totalIncome;

      // Calculate Expense Sum (Keep this part)
      const totalExpense = (expenseData || []).reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      dailyExpenseSums.value[dateString] = totalExpense;
    } catch (err) {
      console.error(`Error fetching sums for ${dateString}:`, err.message);
      error.value = `Failed to fetch sums for ${dateString}: ${err.message}`;
      // Keep sums as 0 if fetch failed
      dailyIncomeSums.value[dateString] = 0;
      dailyExpenseSums.value[dateString] = 0;
    }
  }

  // --- Update fetchIncome and fetchExpense similarly ---
  async function fetchIncome(date) {
    if (!userStore.user?.id || !date) return;
    try {
      loading.value = true; // Example loading state
      error.value = null;

      // --- START: Replace with your API call logic ---
      const response = await fetch(
        `/api/income?userId=${userStore.user.id}&date=${date}`
      );
      if (!response.ok) throw new Error('Failed to fetch income list');
      const data = await response.json();
      // --- END: Replace with your API call logic ---

      incomeList.value = data || [];
    } catch (err) {
      error.value = err.message;
      incomeList.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchExpense(date) {
    if (!userStore.user?.id || !date) return;
    try {
      loading.value = true;
      error.value = null;

      // --- START: Replace with your API call logic ---
      const response = await fetch(
        `/api/expenses?userId=${userStore.user.id}&date=${date}`
      );
      if (!response.ok) throw new Error('Failed to fetch expense list');
      const data = await response.json();
      // --- END: Replace with your API call logic ---

      expenseList.value = data || [];
    } catch (err) {
      error.value = err.message;
      expenseList.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    incomeList,
    expenseList,
    loading,
    error,
    fetchIncome,
    fetchExpense,
    // Expose new state and action
    dailyIncomeSums,
    dailyExpenseSums,
    fetchAndCalculateSumsForDate,
    // ... other actions like add/delete
  };
});
