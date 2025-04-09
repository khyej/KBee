// stores/CalendarStore.js
import { ref, computed, watch } from 'vue'; // Import watch
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
  const today = new Date(); // Get today's date once
  const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1)); // For calendar view month/year, start with today's month
  // --- Initialize selected date state with today's date ---
  const selectedDay = ref(today.getDate());
  const selectedMonth = ref(today.getMonth()); // 0-indexed month
  const selectedYear = ref(today.getFullYear());
  // --- End Initialization ---

  // --- Computed Properties ---
  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth()); // 0-indexed
  const todayDate = computed(() => new Date().getDate()); // Day of the month for 'isToday' check
  const currentMonthName = computed(() => monthNames[month.value]);
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
    Array.from({ length: firstDay.value }, (_, i) => {
      const day = daysInPrevMonth.value - firstDay.value + i + 1;
      // Calculate the actual month/year for prev month days
      let prevMonth = month.value - 1;
      let prevYear = year.value;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      return {
        id: `prev-${day}`, // Use day in ID for potential key usage
        day: day,
        monthIndex: prevMonth, // Store actual month index
        year: prevYear, // Store actual year
        outside: true,
        isToday: false, // Previous month days are never today
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
        monthIndex: month.value, // Store actual month index
        year: year.value, // Store actual year
        outside: false,
        isToday:
          year.value === todayFull.getFullYear() &&
          month.value === todayFull.getMonth() &&
          day === todayFull.getDate(), // Compare with todayFull.getDate()
      };
    })
  );

  const totalDays = computed(
    () => prevMonthDays.value.length + currentMonthDays.value.length
  );

  const nextMonthDays = computed(() =>
    Array.from({ length: 42 - totalDays.value }, (_, i) => {
      const day = i + 1;
      // Calculate the actual month/year for next month days
      let nextMonth = month.value + 1;
      let nextYear = year.value;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }
      return {
        id: `next-${day}`, // Use day in ID
        day: day,
        monthIndex: nextMonth, // Store actual month index
        year: nextYear, // Store actual year
        outside: true,
        isToday: false, // Next month days are never today
      };
    })
  );

  const calendarDays = computed(() => [
    ...prevMonthDays.value,
    ...currentMonthDays.value,
    ...nextMonthDays.value,
  ]);

  // Formatted date string for display/API trigger
  // This will now reflect the initial state (today's date)
  const formattedSelectedDate = computed(() => {
    if (
      selectedDay.value !== null &&
      selectedMonth.value !== null &&
      selectedYear.value !== null
    ) {
      // Format consistent with what TransactionStore expects
      return `${monthNames[selectedMonth.value]} ${selectedDay.value}, ${
        selectedYear.value
      }`;
    }
    return ''; // Return empty string if no date is selected
  });

  // --- Actions ---
  function goToPreviousMonth() {
    currentDate.value = new Date(year.value, month.value - 1, 1);
  }

  function goToNextMonth() {
    currentDate.value = new Date(year.value, month.value + 1, 1);
  }

  function selectDate(date) {
    // Use the monthIndex and year stored directly on the date object
    const targetMonth = date.monthIndex;
    const targetYear = date.year;

    // Check if the same date is clicked again to deselect
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

    // If the clicked date was outside the current view, update the view
    if (date.outside) {
      currentDate.value = new Date(targetYear, targetMonth, 1);
    }

    // Fetching is now handled by the watcher below
  }

  // --- Watcher to Fetch Transactions ---
  // Watch the formattedSelectedDate. When it changes (or initializes), fetch data.
  watch(
    formattedSelectedDate,
    (newFormattedDate) => {
      if (newFormattedDate) {
        // Check if the date string is not empty
        transactionStore.fetchIncome(newFormattedDate);
        transactionStore.fetchExpense(newFormattedDate);
      } else {
        // Optionally clear lists if the date becomes null/empty
        transactionStore.incomeList = [];
        transactionStore.expenseList = [];
      }
    },
    { immediate: true } // Run the watcher immediately on store initialization
  );

  return {
    // State
    selectedDay,
    selectedMonth,
    selectedYear,

    // Computed (for Calendar component)
    currentMonthName,
    currentYear,
    daysOfWeek,
    calendarDays,
    formattedSelectedDate, // Expose for passing to SecondScreen

    // Actions
    goToPreviousMonth,
    goToNextMonth,
    selectDate,
  };
});
