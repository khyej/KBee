<template>
  <div class="summary-wrapper">
    <div class="summary-card">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ monthName }} 수입/지출 요약
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
  transactionStore.incomeList.reduce((sum, item) => sum + (item.amount || 0), 0)
);

const totalExpense = computed(() =>
  transactionStore.expenseList.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  )
);
</script>

<style scoped>
.summary-wrapper {
  margin-left: 24px; /* 달력과의 거리 */
  margin-top: 16px;
}

.summary-card {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 반응형 대응 (선택사항) */
@media (max-width: 768px) {
  .summary-wrapper {
    margin-left: 0;
    margin-top: 24px;
  }
}
</style>
