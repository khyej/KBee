// stores/TransactionStore.js
import { ref, computed } from 'vue'; // Import computed
import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

// --- Date Utility Code (Keep or move to utils) ---
// ... (keep your existing date utility code) ...
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
  // ... (your existing function)
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
  const userStore = useUserStore();

  // --- State ---
  const incomeList = ref([]);
  const expenseList = ref([]);
  // Remove incomeMonthList and expenseMonthList refs, we'll use getters
  const isIncomeLoading = ref(false);
  const isExpenseLoading = ref(false);
  const incomeError = ref(null);
  const expenseError = ref(null);
  const fetchedYear = ref(null); // Keep track of which year's data is loaded

  // --- Actions ---

  // Modified fetchIncome to optionally filter by year using json-server's _like
  async function fetchIncome(year = null) {
    isIncomeLoading.value = true;
    incomeError.value = null;
    try {
      if (!userStore.user?.id) {
        console.warn('User not logged in, cannot fetch income.');
        incomeList.value = [];
        isIncomeLoading.value = false;
        return;
      }

      const params = { user_id: userStore.user.id };
      // Use json-server's filtering: date starts with YYYY-
      if (year) {
        params.date_like = `^${year}-`; // Matches dates starting with the year
        fetchedYear.value = year; // Record the year fetched
      } else {
        fetchedYear.value = null; // Fetched all data, not specific year
        // Potentially remove date_like if you want *all* incomes regardless of year
        // delete params.date_like; // Or handle fetching all if needed
      }

      // Endpoint for individual income records
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

  // Modified fetchExpense to optionally filter by year using json-server's _like
  async function fetchExpense(year = null) {
    isExpenseLoading.value = true;
    expenseError.value = null;
    try {
      if (!userStore.user?.id) {
        console.warn('User not logged in, cannot fetch expenses.');
        expenseList.value = [];
        isExpenseLoading.value = false;
        return;
      }

      const params = { user_id: userStore.user.id };
      // Use json-server's filtering: date starts with YYYY-
      if (year) {
        params.date_like = `^${year}-`; // Matches dates starting with the year
        // fetchedYear is set in fetchIncome, assuming they are fetched together for a year
      } else {
        // Potentially remove date_like if you want *all* expenses regardless of year
        // delete params.date_like; // Or handle fetching all if needed
      }

      // Endpoint for individual expense records
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

  // --- NEW ACTION: Fetch transactions for a specific year ---
  async function fetchTransactionsForYear(year) {
    if (!year || isNaN(parseInt(year, 10))) {
      console.error('Invalid year provided:', year);
      incomeError.value = 'Invalid year provided.'; // Set error state
      expenseError.value = 'Invalid year provided.';
      incomeList.value = []; // Clear lists
      expenseList.value = [];
      fetchedYear.value = null;
      return;
    }
    // Reset errors
    incomeError.value = null;
    expenseError.value = null;

    // Set loading states if desired (can use existing or add specific ones)
    isIncomeLoading.value = true;
    isExpenseLoading.value = true;

    await Promise.all([
      fetchIncome(year), // Fetch income for the year
      fetchExpense(year), // Fetch expense for the year
    ]);

    // Loading states are handled within fetchIncome/fetchExpense
  }

  // --- GETTERS for Monthly Summaries ---

  const monthlyIncomeSummary = computed(() => {
    const summary = {}; // { 'YYYY-MM': totalAmount }
    incomeList.value.forEach((item) => {
      // Ensure item has a valid date and amount
      if (item.date && typeof item.amount === 'number') {
        const monthKey = item.date.substring(0, 7); // Get 'YYYY-MM'
        summary[monthKey] = (summary[monthKey] || 0) + item.amount;
      }
    });
    // Convert to array format [{ month: 'YYYY-MM', totalAmount: X }, ...] sorted by month
    return Object.entries(summary)
      .map(([month, totalAmount]) => ({ month, totalAmount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  });

  const monthlyExpenseSummary = computed(() => {
    const summary = {}; // { 'YYYY-MM': totalAmount }
    expenseList.value.forEach((item) => {
      // Ensure item has a valid date and amount
      if (item.date && typeof item.amount === 'number') {
        const monthKey = item.date.substring(0, 7); // Get 'YYYY-MM'
        summary[monthKey] = (summary[monthKey] || 0) + item.amount;
      }
    });
    // Convert to array format [{ month: 'YYYY-MM', totalAmount: X }, ...] sorted by month
    return Object.entries(summary)
      .map(([month, totalAmount]) => ({ month, totalAmount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  });

  // --- GETTERS for Daily Summaries ---
  const dailyTransactionSummary = computed(() => {
    const summary = {};

    // Process income
    incomeList.value.forEach((income) => {
      const date = income.date;
      if (!summary[date]) {
        summary[date] = { income: 0, expense: 0 };
      }
      summary[date].income += parseFloat(income.amount) || 0;
    });

    // Process expenses
    expenseList.value.forEach((expense) => {
      const date = expense.date;
      if (!summary[date]) {
        summary[date] = { income: 0, expense: 0 };
      }
      summary[date].expense += parseFloat(expense.amount) || 0;
    });

    return summary;
  });

  return {
    // State
    incomeList,
    expenseList,
    isIncomeLoading,
    isExpenseLoading,
    incomeError,
    expenseError,
    fetchedYear, // Expose the year whose data is currently loaded

    // Actions
    fetchIncome, // Keep if needed for fetching single dates/all
    fetchExpense, // Keep if needed for fetching single dates/all
    fetchTransactionsForYear, // <-- Action to get data for monthly summary

    // Getters
    monthlyIncomeSummary, // <-- Use this for monthly income
    monthlyExpenseSummary, // <-- Use this for monthly expense
    dailyTransactionSummary, // Add the new getter to returned object
  };
});
