<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <h2 v-if="selectedDate" class="text-xl font-semibold">
        Selected Date: {{ formattedSelectedDate }}
      </h2>
      <h5 class="text-xl leading-8 font-semibold text-gray-900">
        {{ currentMonth }} {{ currentYear }}
      </h5>
    </div>
    <div>
      <button @click="goToPreviousMonth" class="mr-2">&lt;</button>
      <button @click="goToNextMonth">&gt;</button>
    </div>
  </div>
  <div class="w-full max-w-md mx-auto">
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
</template>

<script setup>
import { ref, computed } from 'vue';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDate = ref(new Date()); // Use ref for reactivity
const selectedDate = ref(null);

const year = computed(() => currentDate.value.getFullYear());
const month = computed(() => currentDate.value.getMonth());
const today = computed(() => new Date().getDate());

// Define currentMonth and currentYear here
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const currentMonth = computed(() => monthNames[month.value]);
const currentYear = computed(() => year.value);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

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

// Function to go to the previous month
const goToPreviousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

// Function to go to the next month
const goToNextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};
const selectDate = (date) => {
  if (!date.outside) {
    if (selectedDate.value?.id === date.id) {
      selectedDate.value = null;
    } else {
      selectedDate.value = date;
    }
  }
};

const isSelected = (date) => {
  return selectedDate.value?.id === date.id;
};

const formattedSelectedDate = computed(() => {
  if (selectedDate.value) {
    const selectedYear = year.value;
    const selectedMonth = month.value;
    const selectedDay = selectedDate.value.day;
    return `${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`;
  }
  return '';
});
</script>

<style scoped>
.text-gray-400 {
  color: #9ca3af;
}
</style>
