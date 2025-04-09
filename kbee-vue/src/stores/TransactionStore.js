// stores/TransactionStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// --- Date Utility Code (Keep or move to utils) ---
const monthNames = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const convertToYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split(/[\s,]+/).filter((part) => part);
  if (parts.length < 3) {
    console.error('Invalid date format for splitting:', dateStr);
    return null;
  }
  const [monthStr, dayStr, yearStr] = parts;
  const monthIndex = monthNames.indexOf(monthStr);
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
    console.error('Invalid date components:', {
      monthStr,
      dayStr,
      yearStr,
      dateStr,
    });
    return null;
  }

  const month = (monthIndex + 1).toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  return `${year}-${month}-${formattedDay}`;
};
// --- End of Date Utility Code ---

export const useTransactionStore = defineStore('transactions', () => {
  // --- State ---
  const incomeList = ref([]);
  const expenseList = ref([]);
  const isIncomeLoading = ref(false);
  const isExpenseLoading = ref(false);
  const incomeError = ref(null);
  const expenseError = ref(null);

  // --- Actions ---

  async function fetchIncome(selectedDateString) {
    const dateToFetch = convertToYYYYMMDD(selectedDateString);
    if (!dateToFetch) {
      // Only fetch if a date is selected/passed
      incomeList.value = []; // Clear if no date
      return;
    }

    isIncomeLoading.value = true;
    incomeError.value = null;

    try {
      const params = { user_id: 1 }; // Consider making dynamic
      if (dateToFetch) {
        params.date = dateToFetch;
      }
      const res = await axios.get('/api/incomes', { params });
      incomeList.value = res.data;
    } catch (err) {
      console.error('Error fetching income in store:', err);
      incomeError.value = 'Failed to load income data.';
      incomeList.value = [];
    } finally {
      isIncomeLoading.value = false;
    }
  }

  async function fetchExpense(selectedDateString) {
    const dateToFetch = convertToYYYYMMDD(selectedDateString);
    if (!dateToFetch) {
      // Only fetch if a date is selected/passed
      expenseList.value = []; // Clear if no date
      return;
    }

    isExpenseLoading.value = true;
    expenseError.value = null;

    try {
      const params = { user_id: 1 }; // Consider making dynamic
      if (dateToFetch) {
        params.date = dateToFetch;
      }
      const res = await axios.get('/api/expenses', { params });
      expenseList.value = res.data;
    } catch (err) {
      console.error('Error fetching expense in store:', err);
      expenseError.value = 'Failed to load expense data.';
      expenseList.value = [];
    } finally {
      isExpenseLoading.value = false;
    }
  }

  // Optional: Action to fetch both (if needed) - Can be removed if CalendarStore handles triggering both
  // async function fetchAllTransactions(selectedDateString) {
  //    await Promise.all([
  //       fetchIncome(selectedDateString),
  //       fetchExpense(selectedDateString)
  //    ]);
  // }

  return {
    // State
    incomeList,
    expenseList,
    isIncomeLoading,
    isExpenseLoading,
    incomeError,
    expenseError,

    // Actions
    fetchIncome,
    fetchExpense,
    // fetchAllTransactions, // Expose if needed elsewhere
  };
});
