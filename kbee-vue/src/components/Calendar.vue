<template>
  <h5 class="text-xl leading-8 font-semibold text-gray-900">
    {{ currentMonth }} {{ currentYear }}
  </h5>
  <div class="w-full max-w-md mx-auto">
    <div class="grid grid-cols-7 text-center font-semibold text-gray-600">
      <div v-for="day in daysOfWeek" :key="day" class="p-2">{{ day }}</div>
    </div>
    <div class="grid grid-cols-7 divide-gray-200">
      <div
        v-for="date in calendarDays"
        :key="date.id"
        class="p-3.5 bg-gray-50 xl:aspect-auto lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100"
        :class="{
          'text-gray-400': date.outside,
          'bg-indigo-100': date.isToday,
        }"
      >
        <span
          class="text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full"
          :class="{ 'bg-indigo-600 text-white': date.isToday }"
        >
          {{ date.day }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const today = now.getDate();

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
const currentMonth = computed(() => monthNames[month]);
const currentYear = computed(() => year);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const daysInCurrentMonth = getDaysInMonth(year, month);
const firstDay = getFirstDayOfMonth(year, month);
const daysInPrevMonth = getDaysInMonth(year, month - 1);

const prevMonthDays = Array.from({ length: firstDay }, (_, i) => ({
  id: `prev-${i}`,
  day: daysInPrevMonth - firstDay + i + 1,
  outside: true,
  isToday: false,
}));

const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => {
  const day = i + 1;
  return {
    id: `current-${day}`,
    day,
    outside: false,
    isToday: day === today,
  };
});

const totalDays = prevMonthDays.length + currentMonthDays.length;
const nextMonthDays = Array.from({ length: 42 - totalDays }, (_, i) => ({
  id: `next-${i}`,
  day: i + 1,
  outside: true,
  isToday: false,
}));

const calendarDays = computed(() => [
  ...prevMonthDays,
  ...currentMonthDays,
  ...nextMonthDays,
]);
</script>

<style scoped>
.text-gray-400 {
  color: #9ca3af;
}
</style>
