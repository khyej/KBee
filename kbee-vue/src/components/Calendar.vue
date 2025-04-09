<template>
  <div class="h-screen flex overflow-hidden">
    <div
      class="flex flex-col items-center justify-center bg-amber-100 p-4 w-5/7"
      style="height: 100vh"
    >
      <div class="flex items-center justify-between mb-4 w-full">
        <!-- Use store computed properties -->
        <h5 class="text-xl leading-8 font-semibold text-gray-900 mr-4">
          {{ calendarStore.currentYear }}년 {{ calendarStore.currentMonthName }}
        </h5>
        <div class="flex items-center">
          <!-- Use store actions -->
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
      <div
        class="w-full max-w-screen mx-auto shadow-blue-950 rounded-lg bg-white calendar-grid-container"
      >
        <!-- Use store computed properties -->
        <div class="grid grid-cols-7 text-center font-semibold text-gray-600">
          <div v-for="day in calendarStore.daysOfWeek" :key="day" class="p-2">
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 divide-gray-200">
          <!-- Use store computed properties and actions -->
          <button
            v-for="date in calendarStore.calendarDays"
            :key="date.id"
            class="p-3.5 bg-gray-50 xl:aspect-auto lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100 focus:outline-none"
            :class="{
              'text-gray-400': date.outside,
              'bg-indigo-100': date.isToday,
              'bg-yellow-200': isSelected(date), // Keep local isSelected
            }"
            @click="calendarStore.selectDate(date)"
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

    <!-- Keep SecondScreen logic local -->
    <div v-if="showSecondScreen" class="w-2/7 h-screen">
      <!-- Pass formatted date from store -->
      <SecondScreen :selectedDate="calendarStore.formattedSelectedDate" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // Only ref needed now
import SecondScreen from './SecondScreen.vue';
import { useCalendarStore } from '../stores/CalendarStore'; // Import the new store

// Get the calendar store instance
const calendarStore = useCalendarStore();

// Keep UI state local
const showSecondScreen = ref(true);

// Keep isSelected logic local, but reference store state
const isSelected = (date) => {
  // Reference store's selected date state
  if (
    calendarStore.selectedDay === null ||
    calendarStore.selectedMonth === null ||
    calendarStore.selectedYear === null
  ) {
    return false;
  }

  // Need month/year from store to compare correctly
  const currentViewMonth = calendarStore.currentDate?.value.getMonth(); // Access internal state if needed, or derive
  const currentViewYear = calendarStore.currentDate?.value.getFullYear(); // Or expose month/year computed from store

  // Simplified logic - assumes selectDate handles setting correct month/year
  // If date is outside, the selectDate action handles the logic
  // We just need to check if the store's selected date matches this date's day, month, year
  // Note: This requires careful handling in selectDate to ensure selectedMonth/Year are correct
  // OR expose current view month/year from store if needed for comparison here.
  // Let's assume selectDate correctly sets selectedMonth/Year based on the *actual* date clicked

  return (
    calendarStore.selectedDay === date.day &&
    calendarStore.selectedMonth ===
      (date.outside
        ? date.id.startsWith('prev')
          ? (currentViewMonth - 1 + 12) % 12
          : (currentViewMonth + 1) % 12
        : currentViewMonth) && // Approximate month check
    calendarStore.selectedYear ===
      (date.outside
        ? date.id.startsWith('prev')
          ? currentViewMonth === 0
            ? currentViewYear - 1
            : currentViewYear
          : currentViewMonth === 11
          ? currentViewYear + 1
          : currentViewYear
        : currentViewYear) // Approximate year check
  );

  // --- A potentially simpler isSelected (relies on selectDate setting correctly) ---
  // return (
  //   !date.outside && // Only highlight if it's in the current month view *after* potential navigation
  //   calendarStore.selectedDay === date.day &&
  //   calendarStore.selectedMonth === calendarStore.currentDate.value.getMonth() && // Check against current view month
  //   calendarStore.selectedYear === calendarStore.currentDate.value.getFullYear() // Check against current view year
  // );
  // ^^ This simpler version might be incorrect if you click a date from prev/next month.
  // The more complex one tries to calculate the target month/year.
  // The *best* way is often to ensure `selectDate` sets `selectedMonth` and `selectedYear` to the *actual* month/year of the clicked day.

  // Let's stick to the most direct comparison assuming selectDate sets correctly:
  return (
    calendarStore.selectedDay === date.day &&
    calendarStore.selectedMonth ===
      (date.outside
        ? date.id.startsWith('prev')
          ? (new Date(
              calendarStore.currentYear,
              calendarStore.currentMonthName,
              1
            ).getMonth() -
              1 +
              12) %
            12
          : (new Date(
              calendarStore.currentYear,
              calendarStore.currentMonthName,
              1
            ).getMonth() +
              1) %
            12
        : new Date(
            calendarStore.currentYear,
            calendarStore.currentMonthName,
            1
          ).getMonth()) &&
    calendarStore.selectedYear ===
      (date.outside
        ? date.id.startsWith('prev')
          ? new Date(
              calendarStore.currentYear,
              calendarStore.currentMonthName,
              1
            ).getMonth() === 0
            ? calendarStore.currentYear - 1
            : calendarStore.currentYear
          : new Date(
              calendarStore.currentYear,
              calendarStore.currentMonthName,
              1
            ).getMonth() === 11
          ? calendarStore.currentYear + 1
          : calendarStore.currentYear
        : calendarStore.currentYear)
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
