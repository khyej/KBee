// stores/incomeStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// Keep monthNames here or move to a shared utility file if used elsewhere
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

// Keep this utility function here if it's primarily used for income fetching,
// or move to a shared utility file (e.g., utils/dateUtils.js)
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

export const useIncomeStore = defineStore('income', () => {
  // --- State ---
  const incomeList = ref([]);
  const isLoading = ref(false); // Optional: track loading state
  const error = ref(null); // Optional: track errors

  // --- Actions ---
  async function fetchIncome(selectedDateString) {
    isLoading.value = true;
    error.value = null;
    const formattedDate = convertToYYYYMMDD(selectedDateString);

    try {
      // Consider making user_id dynamic or configurable
      const params = { user_id: 1 };
      if (formattedDate) {
        params.date = formattedDate;
      }
      // Use the full URL or ensure Axios base URL is configured
      const res = await axios.get('/api/incomes', { params });
      incomeList.value = res.data;
    } catch (err) {
      console.error('Error fetching income in store:', err);
      error.value = 'Failed to load income data.'; // Store user-friendly error
      incomeList.value = []; // Clear list on error
    } finally {
      isLoading.value = false;
    }
  }

  // --- Getters (Implicit via returning refs/computed) ---
  // You could add computed properties here if needed, e.g., total income

  return {
    // State
    incomeList,
    isLoading,
    error,
    // Actions
    fetchIncome,
  };
});
