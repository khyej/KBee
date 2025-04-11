<template>
  <div class="summary-wrapper">
    <div class="summary-card">
      <h3 class="text-lg font-semibold text-gray-800">
        <!-- {{ calendarStore.selectedMonth }} -->
        <!-- {{ calendarStore.currentMonthName.slice(0, -1) }} -->
        <!-- {{ calendarStore.currentYear }} -->
        {{ monthName }} 수입/지출 요약
        <!-- {{ transactionStore.expenseList }} 수입/지출 요약 -->
      </h3>
      <div class="text-green-600 font-bold">
        수입: +{{ totalIncome.toLocaleString() }}원
      </div>
      <div class="text-red-500 font-bold">
        지출: -{{ totalExpense.toLocaleString() }}원
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/TransactionStore';
import { useCalendarStore } from '@/stores/CalendarStore';

const transactionStore = useTransactionStore();
const calendarStore = useCalendarStore();

const monthName = computed(() => calendarStore.currentMonthName);

const totalIncome = computed(() =>
  transactionStore.incomeList
    .filter((item) => item.date.startsWith(calendarStore.currentYearMonth))
    .reduce((sum, item) => sum + (item.amount || 0), 0)
);

const totalExpense = computed(() =>
  transactionStore.expenseList
    .filter((item) => item.date.startsWith(calendarStore.currentYearMonth))
    .reduce((sum, item) => sum + (item.amount || 0), 0)
);
</script>

<style scoped>
.summary-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0px 40px;
  /* min-height: 100vh; */
  width: 90%;
}

.summary-card {
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  text-align: center;

  height: 150px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 반응형 대응 (선택사항) */
@media (max-width: 768px) {
  .summary-wrapper {
    margin-left: 0;
    margin-top: 24px;
  }
}
</style>
