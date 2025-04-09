// stores/CalendarStore.js
import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useTransactionStore } from './TransactionStore';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

export const useCalendarStore = defineStore('calendar', () => {
  const transactionStore = useTransactionStore();

  const today = new Date();
  const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
  const selectedDay = ref(today.getDate());
  const selectedMonth = ref(today.getMonth()); // 0-indexed month
  const selectedYear = ref(today.getFullYear());

  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth()); // 0-indexed
  const todayDate = computed(() => new Date().getDate());
  const currentMonthName = computed(() => monthNames[month.value]);
  const currentYear = computed(() => year.value);
  const currentMonthIndex = month; // Keep 0-indexed month

  // --- NEW: Computed property for YYYY-MM format ---
  const currentYearMonth = computed(() => {
    const y = currentYear.value;
    // Add 1 to the 0-indexed month and pad with '0'
    const m = String(month.value + 1).padStart(2, '0');
    return `${y}-${m}`; // e.g., "2024-03"
  });
  // --- End New Property ---

  // Helper functions
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  // Computed properties for calendar days (no changes needed here)
  const daysInCurrentMonth = computed(() =>
    getDaysInMonth(year.value, month.value)
  );
  const firstDay = computed(() => getFirstDayOfMonth(year.value, month.value));
  const daysInPrevMonth = computed(() =>
    getDaysInMonth(year.value, month.value - 1)
  );

  const prevMonthDays = computed(() =>
    Array.from({ length: firstDay.value }, (_, i) => {
      const day = daysInPrevMonth.value - firstDay.value + i + 1;
      let prevMonth = month.value - 1;
      let prevYear = year.value;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      return {
        id: `prev-${day}`,
        day: day,
        monthIndex: prevMonth,
        year: prevYear,
        outside: true,
        isToday: false,
      };
    })
  );

  const currentMonthDays = computed(() =>
    Array.from({ length: daysInCurrentMonth.value }, (_, i) => {
      const day = i + 1;
      const todayFull = new Date();
      return {
        id: `current-${day}`,
        day,
        monthIndex: month.value,
        year: year.value,
        outside: false,
        isToday:
          year.value === todayFull.getFullYear() &&
          month.value === todayFull.getMonth() &&
          day === todayFull.getDate(),
      };
    })
  );

  const totalDays = computed(
    () => prevMonthDays.value.length + currentMonthDays.value.length
  );

  const nextMonthDays = computed(() =>
    Array.from({ length: 42 - totalDays.value }, (_, i) => {
      const day = i + 1;
      let nextMonth = month.value + 1;
      let nextYear = year.value;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }
      return {
        id: `next-${day}`,
        day: day,
        monthIndex: nextMonth,
        year: nextYear,
        outside: true,
        isToday: false,
      };
    })
  );

  const calendarDays = computed(() => [
    ...prevMonthDays.value,
    ...currentMonthDays.value,
    ...nextMonthDays.value,
  ]);

  const formattedSelectedDate = computed(() => {
    if (
      selectedDay.value !== null &&
      selectedMonth.value !== null &&
      selectedYear.value !== null
    ) {
      return `${monthNames[selectedMonth.value]} ${selectedDay.value}, ${
        selectedYear.value
      }`;
    }
    return '';
  });

  // --- Actions ---
  function goToPreviousMonth() {
    currentDate.value = new Date(year.value, month.value - 1, 1);
  }

  function goToNextMonth() {
    currentDate.value = new Date(year.value, month.value + 1, 1);
  }

  function selectDate(date) {
    const targetMonth = date.monthIndex;
    const targetYear = date.year;

    if (
      selectedDay.value === date.day &&
      selectedMonth.value === targetMonth &&
      selectedYear.value === targetYear
    ) {
      return;
    }
    selectedDay.value = date.day;
    selectedMonth.value = targetMonth;
    selectedYear.value = targetYear;

    if (date.outside) {
      currentDate.value = new Date(targetYear, targetMonth, 1);
    }
  }

  // --- Watcher to Fetch Transactions ---
  // This watcher currently fetches data for the *selected day*.
  // If you want to fetch data for the *entire year* when the year changes,
  // you would need a different watcher or trigger mechanism.
  watch(
    formattedSelectedDate,
    (newFormattedDate) => {
      if (newFormattedDate) {
        // TransactionStore's fetchIncome/Expense expect "Month Day, Year"
        // and internally convert it to YYYY-MM-DD for the API call.
        // The API call itself seems to fetch for that specific day.
        transactionStore.fetchIncome(newFormattedDate);
        transactionStore.fetchExpense(newFormattedDate);
      } else {
        // Clear lists if no date is selected
        transactionStore.incomeList.value = []; // Use .value with refs
        transactionStore.expenseList.value = []; // Use .value with refs
      }
    },
    { immediate: true }
  );

  return {
    // State
    selectedDay,
    selectedMonth, // 0-indexed
    selectedYear,

    // Computed (for Calendar component)
    currentMonthName, // e.g., "3월"
    currentYear, // e.g., 2024
    currentMonthIndex, // 0-indexed month
    currentYearMonth, // --- ADDED: e.g., "2024-03" ---
    daysOfWeek,
    calendarDays,
    formattedSelectedDate, // Expose for passing to SecondScreen

    // Actions
    goToPreviousMonth,
    goToNextMonth,
    selectDate,
  };
});
