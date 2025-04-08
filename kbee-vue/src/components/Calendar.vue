<template>
  <div class="h-screen flex overflow-hidden">
    <div
      class="flex flex-col items-center justify-center bg-amber-100 p-4 w-5/7"
      style="height: 100vh"
    >
      <div class="flex items-center justify-between mb-4 w-full">
        <h5 class="text-xl leading-8 font-semibold text-gray-900 mr-4">
          {{ currentYear }}년 {{ currentMonth }}
        </h5>
        <div class="flex items-center">
          <button
            @click="goToPreviousMonth"
            class="mr-2 px-2 py-1 bg-gray-300 rounded"
            aria-label="Previous Month"
          >
            &lt;
          </button>
          <button
            @click="goToNextMonth"
            class="px-2 py-1 bg-gray-300 rounded"
            aria-label="Next Month"
          >
            &gt;
          </button>
        </div>
      </div>
      <div
        class="w-full max-w-screen mx-auto shadow-blue-950 rounded-lg bg-white calendar-grid-container"
      >
        <div class="grid grid-cols-7 text-center font-semibold text-gray-600">
          <div v-for="day in daysOfWeek" :key="day" class="p-2">{{ day }}</div>
        </div>
        <div class="grid grid-cols-7 divide-gray-200">
          <button
            v-for="date in calendarDays"
            :key="date.id"
            class="p-3.5 bg-gray-50 xl:aspect-auto lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100 focus:outline-none"
            :class="{
              'text-gray-400': date.outside,
              'bg-indigo-100': date.isToday,
              'bg-yellow-200': isSelected(date),
            }"
            @click="selectDate(date)"
          >
            <span
              class="text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full"
              :class="{ 'bg-indigo-600 text-white': date.isToday }"
            >
              {{ date.day }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSecondScreen" class="w-2/7 h-screen">
      <SecondScreen :selectedDate="formattedSelectedDate" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SecondScreen from './SecondScreen.vue';

// Constants
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

// Reactive state
const currentDate = ref(new Date());
const selectedDay = ref(null);
const selectedMonth = ref(null);
const selectedYear = ref(null);
const showSecondScreen = ref(true);

// Computed properties for date information
const year = computed(() => currentDate.value.getFullYear());
const month = computed(() => currentDate.value.getMonth());
const today = computed(() => new Date().getDate());
const currentMonth = computed(() => monthNames[month.value]);
const currentYear = computed(() => year.value);

// Helper functions for calendar calculations
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

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
    return {
      id: `current-${day}`,
      day,
      outside: false,
      isToday:
        year.value === new Date().getFullYear() &&
        month.value === new Date().getMonth() &&
        day === today.value,
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

// Computed property for formatted selected date
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

// Methods
const goToPreviousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const goToNextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const selectDate = (date) => {
  if (date.outside) {
    if (date.id.startsWith('prev')) {
      goToPreviousMonth();
      selectedDay.value = date.day;
      selectedMonth.value = month.value - 1 < 0 ? 11 : month.value - 1;
      selectedYear.value = month.value - 1 < 0 ? year.value - 1 : year.value;
    } else {
      goToNextMonth();
      selectedDay.value = date.day;
      selectedMonth.value = month.value + 1 > 11 ? 0 : month.value + 1;
      selectedYear.value = month.value + 1 > 11 ? year.value + 1 : year.value;
    }
  } else {
    if (
      selectedDay.value === date.day &&
      selectedMonth.value === month.value &&
      selectedYear.value === year.value
    ) {
      selectedDay.value = null;
      selectedMonth.value = null;
      selectedYear.value = null;
    } else {
      selectedDay.value = date.day;
      selectedMonth.value = month.value;
      selectedYear.value = year.value;
    }
  }
};

const isSelected = (date) => {
  if (
    selectedDay.value === null ||
    selectedMonth.value === null ||
    selectedYear.value === null
  ) {
    return false;
  }

  const targetMonth = date.outside
    ? date.id.startsWith('prev')
      ? month.value - 1 < 0
        ? 11
        : month.value - 1
      : month.value + 1 > 11
      ? 0
      : month.value + 1
    : month.value;

  const targetYear = date.outside
    ? date.id.startsWith('prev')
      ? month.value - 1 < 0
        ? year.value - 1
        : year.value
      : month.value + 1 > 11
      ? year.value + 1
      : year.value
    : year.value;

  return (
    selectedDay.value === date.day &&
    selectedMonth.value === targetMonth &&
    selectedYear.value === targetYear
  );
};
</script>

<style scoped>
.text-gray-400 {
  color: #9ca3af;
}

.calendar-grid-container {
  border-bottom-left-radius: 0.5rem;
  /* Adjust the radius as needed */
  border-bottom-right-radius: 0.5rem;
  /* Adjust the radius as needed */
  overflow: hidden;
}
</style>
