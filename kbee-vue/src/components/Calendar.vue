<template>
  <div class="h-screen flex overflow-hidden">
    <div
      class="flex flex-col items-center justify-center bg-amber-100 p-4 w-5/7"
      style="height: 100vh"
    >
      <!-- Header, User ID -->
      <div class="flex items-center justify-between mb-4 w-full">
        <!-- Make sure your actual month/year header content is here -->
        <h5 class="text-xl leading-8 font-semibold text-gray-900 mr-4">
          {{ calendarStore.currentYear }}년 {{ calendarStore.currentMonthName }}
        </h5>
        <div class="flex items-center">
          <button
            @click="calendarStore.goToPreviousMonth"
            class="mr-2 px-2 py-1 bg-gray-300 rounded"
            aria-label="Previous Month"
          >
            &lt;
          </button>
          <button
            @click="calendarStore.goToNextMonth"
            class="px-2 py-1 bg-gray-300 rounded"
            aria-label="Next Month"
          >
            &gt;
          </button>
        </div>
      </div>
      <p class="text-sm mb-1 text-gray-600 w-full px-2">
        User ID: {{ userStore.user?.id || 'Loading...' }}
      </p>

      <!-- Displayed Dates - Corrected Expression -->
      <h1
        class="text-sm mb-2 text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap w-full px-2"
      >
        Displayed Dates:
        {{
          calendarStore.calendarDays
            .map((date) => {
              const month = String(date.monthIndex + 1).padStart(2, '0');
              const day = String(date.day).padStart(2, '0');
              return `${date.year}-${month}-${day}`; // Replaced comment with actual expression
            })
            .join(', ')
        }}
      </h1>

      <!-- Rest of the template -->
      <div
        class="w-full max-w-screen mx-auto shadow-blue-950 rounded-lg bg-white calendar-grid-container"
      >
        <!-- Days of the Week Header -->
        <div class="grid grid-cols-7 text-center font-semibold text-gray-600">
          <div v-for="day in calendarStore.daysOfWeek" :key="day" class="p-2">
            {{ day }}
          </div>
        </div>
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 divide-gray-200">
          <button
            v-for="date in calendarStore.calendarDays"
            :key="date.id"
            class="relative p-3.5 bg-gray-50 xl:aspect-auto lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100 focus:outline-none"
            :class="{
              'text-gray-400': date.outside,
              'bg-indigo-100': date.isToday,
              'bg-yellow-200': isSelected(date),
            }"
            @click="calendarStore.selectDate(date)"
          >
            <!-- Date Number Span -->
            <span
              class="text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full z-10 relative"
              :class="{ 'bg-indigo-600 text-white': date.isToday }"
            >
              {{ date.day }}
            </span>

            <!-- Conditional Div and Sums for Day 1 -->
            <template v-if="date.day === 1 && !date.outside">
              <!-- Cyan Background Div -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-50"
              >
                <div class="bg-cyan-500 h-16 w-16 rounded"></div>
              </div>
              <!-- Display Sums -->
              <div class="text-xs mt-1 z-10 relative text-center">
                <p class="text-green-700 font-medium">
                  In:
                  {{
                    transactionStore.dailyIncomeSums[
                      formatDateForStore(date)
                    ] ?? '...'
                  }}
                </p>
                <p class="text-red-700 font-medium">
                  Out:
                  {{
                    transactionStore.dailyExpenseSums[
                      formatDateForStore(date)
                    ] ?? '...'
                  }}
                </p>
              </div>
            </template>
            <!-- End Conditional Div -->
          </button>
        </div>
      </div>
    </div>

    <!-- Second Screen -->
    <div v-if="showSecondScreen" class="w-2/7 h-screen">
      <SecondScreen :selectedDate="calendarStore.formattedSelectedDate" />
    </div>
  </div>
</template>

<script setup>
// Script setup remains the same
import { ref } from 'vue';
import SecondScreen from './SecondScreen.vue';
import { useCalendarStore } from '../stores/CalendarStore';
import { useUserStore } from '../stores/user';
import { useTransactionStore } from '../stores/TransactionStore';

const calendarStore = useCalendarStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const showSecondScreen = ref(true);

const formatDateForStore = (date) => {
  if (!date) return '';
  const month = String(date.monthIndex + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${date.year}-${month}-${day}`;
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
/* Styles remain the same */
.text-gray-400 {
  color: #9ca3af;
}

.calendar-grid-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
}
</style>
