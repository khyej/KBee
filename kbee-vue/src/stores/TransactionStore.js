// stores/TransactionStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// --- Date Utility Code (moved directly into this file) ---
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
  // Handle potential empty string from split if dateStr is weird
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

  // Action to fetch income data
  async function fetchIncome(selectedDateString) {
    isIncomeLoading.value = true;
    incomeError.value = null;
    // Use the utility function defined above in this file
    const formattedDate = convertToYYYYMMDD(selectedDateString);

    try {
      const params = { user_id: 1 }; // Consider making dynamic
      if (formattedDate) {
        params.date = formattedDate;
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

  // Action to fetch expense data
  async function fetchExpense(selectedDateString) {
    isExpenseLoading.value = true;
    expenseError.value = null;
    // Use the utility function defined above in this file
    const formattedDate = convertToYYYYMMDD(selectedDateString);

    try {
      const params = { user_id: 1 }; // Consider making dynamic
      if (formattedDate) {
        params.date = formattedDate;
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

  // Optional: Action to fetch both
  async function fetchAllTransactions(selectedDateString) {
    await Promise.all([
      fetchIncome(selectedDateString),
      fetchExpense(selectedDateString),
    ]);
  }

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
    fetchAllTransactions,
  };
});
