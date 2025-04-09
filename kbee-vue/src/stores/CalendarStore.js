// stores/CalendarStore.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
// Import the transaction store to trigger fetches when a date is selected
import { useTransactionStore } from './TransactionStore';

// Constants can live here or in a shared utils file
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
  // Inject the transaction store
  const transactionStore = useTransactionStore();

  // --- State ---
  const currentDate = ref(new Date()); // For calendar view month/year
  const selectedDay = ref(null);
  const selectedMonth = ref(null); // 0-indexed month
  const selectedYear = ref(null);

  // --- Computed Properties ---
  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth()); // 0-indexed
  const todayDate = computed(() => new Date().getDate()); // Renamed to avoid conflict
  const currentMonthName = computed(() => monthNames[month.value]); // Renamed
  const currentYear = computed(() => year.value);

  // Helper functions (can remain internal)
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  // Computed properties for calendar days
  const daysInCurrentMonth = computed(() =>
    getDaysInMonth(year.value, month.value)
  );
  const firstDay = computed(() => getFirstDayOfMonth(year.value, month.value));
  const daysInPrevMonth = computed(() =>
    getDaysInMonth(year.value, month.value - 1)
  );

  const prevMonthDays = computed(() =>
    Array.from({ length: firstDay.value }, (_, i) => ({
      id: `prev-${i}`,
      day: daysInPrevMonth.value - firstDay.value + i + 1,
      outside: true,
      isToday: false,
    }))
  );

  const currentMonthDays = computed(() =>
    Array.from({ length: daysInCurrentMonth.value }, (_, i) => {
      const day = i + 1;
      const todayFull = new Date();
      return {
        id: `current-${day}`,
        day,
        outside: false,
        isToday:
          year.value === todayFull.getFullYear() &&
          month.value === todayFull.getMonth() &&
          day === todayDate.value, // Use computed todayDate
      };
    })
  );

  const totalDays = computed(
    () => prevMonthDays.value.length + currentMonthDays.value.length
  );
  const nextMonthDays = computed(() =>
    Array.from({ length: 42 - totalDays.value }, (_, i) => ({
      id: `next-${i}`,
      day: i + 1,
      outside: true,
      isToday: false,
    }))
  );

  const calendarDays = computed(() => [
    ...prevMonthDays.value,
    ...currentMonthDays.value,
    ...nextMonthDays.value,
  ]);

  // Formatted date string for display/API trigger
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
    let targetMonth = month.value;
    let targetYear = year.value;
    let needsViewChange = false;

    if (date.outside) {
      needsViewChange = true; // Mark that the view needs to change
      if (date.id.startsWith('prev')) {
        targetMonth = month.value - 1;
        if (targetMonth < 0) {
          targetMonth = 11;
          targetYear = year.value - 1;
        }
      } else {
        // next month
        targetMonth = month.value + 1;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear = year.value + 1;
        }
      }
    }

    // Check if the same date is clicked again to deselect
    if (
      selectedDay.value === date.day &&
      selectedMonth.value === targetMonth &&
      selectedYear.value === targetYear
    ) {
      selectedDay.value = null;
      selectedMonth.value = null;
      selectedYear.value = null;
      // Clear transactions when date is deselected
      transactionStore.incomeList = []; // Directly modify or add clear actions
      transactionStore.expenseList = [];
    } else {
      selectedDay.value = date.day;
      selectedMonth.value = targetMonth;
      selectedYear.value = targetYear;

      // If the clicked date was outside the current view, update the view
      if (needsViewChange) {
        currentDate.value = new Date(targetYear, targetMonth, 1);
      }

      // Fetch transactions for the newly selected date using the computed property
      // which updates automatically based on the new selection state.
      transactionStore.fetchIncome(formattedSelectedDate.value);
      transactionStore.fetchExpense(formattedSelectedDate.value);
    }
  }

  return {
    // State
    // currentDate, // Only expose if needed outside the store/calendar component
    selectedDay,
    selectedMonth,
    selectedYear,

    // Computed (for Calendar component)
    currentMonthName,
    currentYear,
    daysOfWeek, // Expose constant for template
    calendarDays,
    formattedSelectedDate, // Expose for passing to SecondScreen

    // Actions
    goToPreviousMonth,
    goToNextMonth,
    selectDate,
  };
});
