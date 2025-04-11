<template>
  <div class="flex overflow-hidden max-h-[85vh]">
    <div class="flex flex-col items-center justify-center bg-white p-4 w-5/7 rounded-2xl overflow-hidden max-h-[85vh]">
      <!-- Existing Month/Year Header -->
      <div class="flex items-center justify-between mb-4 w-full">
        <h5 class="text-xl leading-8 font-semibold text-gray-900 mr-4">
          {{ calendarStore.currentYear }}년 {{ calendarStore.currentMonthName }}
        </h5>
        <div class="flex items-center">
          <button @click="calendarStore.goToPreviousMonth" class="mr-2 px-2 py-1 bg-gray-300 rounded"
            aria-label="Previous Month">
            &lt;
          </button>
          <button @click="calendarStore.goToNextMonth" class="px-2 py-1 bg-gray-300 rounded" aria-label="Next Month">
            &gt;
          </button>
        </div>
      </div>

      <div class="w-full max-w-screen mx-auto shadow-blue-950 rounded-lg bg-white calendar-grid-container">
        <!-- Days of the Week Header -->
        <div class="grid grid-cols-7 text-center font-semibold text-gray-600 bg-amber-100">
          <div v-for="day in calendarStore.daysOfWeek" :key="day" class="p-2">
            {{ day }}
          </div>
        </div>
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 divide-gray-200">
          <button v-for="date in calendarStore.calendarDays" :key="date.id"
            class="p-3.5 bg-gray-50 xl:aspect-auto lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100 focus:outline-none"
            :class="{
              'text-gray-400': date.outside,
              'bg-indigo-100': date.isToday,
              'bg-yellow-200': isSelected(date),
            }" @click="selectCalDate(date)">
            <span class="text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full"
              :class="{ 'bg-indigo-600 text-white': date.isToday }">
              {{ date.day }}
            </span>
            <div class="flex flex-col text-xs">
              <span v-if="getDailyTotals(date).income > 0"
                class="text-green-600 bg-green-200 rounded-full px-1 p-0.5 hover:scale-110 transition-transform duration-300 shadow-sm drop-shadow-black">
                +{{ getDailyTotals(date).income.toLocaleString() }}
              </span>
              <span v-if="getDailyTotals(date).expense > 0"
                class="text-red-600 bg-red-200 rounded-full px-1 p-0.5 hover:scale-110 transition-transform duration-300 shadow-md drop-shadow-black">
                -{{ getDailyTotals(date).expense.toLocaleString() }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Second Screen -->
    <div v-if="showSecondScreen" class="w-2/7 h-screen">
      <!-- Pass formatted date from store -->
      <MonthInEx :month="selectedMonth" :income="aprilIncome" :expense="aprilExpense" :selectedDate="caldate" />
      <SecondScreen :selectedDate="caldate" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SecondScreen from './SecondScreen.vue';
import { useCalendarStore } from '../stores/CalendarStore';
import MonthInEx from './MonthInEx.vue';
import { useUserStore } from '@/stores/user';
import { useTransactionStore } from '../stores/TransactionStore';

const calendarStore = useCalendarStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const showSecondScreen = ref(true);

// 오늘 날짜 기준 초기 caldate 설정
const today = new Date();
const caldate = ref(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`
);

const formatDate = (date) => {
  const month = String(date.monthIndex + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${date.year}-${month}-${day}`;
};

const selectCalDate = (date) => {
  caldate.value = formatDate(date);
  calendarStore.selectDate(date);
};

const getDailyTotals = (date) => {
  const formattedDate = formatDate(date);
  const summary = transactionStore.dailyTransactionSummary[formattedDate] || {
    income: 0,
    expense: 0,
  };
  return summary;
};

const isSelected = (date) => {
  return (
    calendarStore.selectedDay === date.day &&
    calendarStore.selectedMonth === date.monthIndex &&
    calendarStore.selectedYear === date.year
  );
};
</script>


<style scoped>
.text-gray-400 {
  color: #9ca3af;
}

.calendar-grid-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
}
</style>
