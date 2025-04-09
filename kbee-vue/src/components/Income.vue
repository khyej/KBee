<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">💰 수입 내역</h3>
    <!-- Use the specific loading/error states from the transaction store -->
    <div v-if="transactionStore.isIncomeLoading">Loading...</div>
    <div v-else-if="transactionStore.incomeError" class="text-red-500">
      {{ transactionStore.incomeError }}
    </div>
    <ul v-else-if="transactionStore.incomeList.length > 0">
      <li
        v-for="item in transactionStore.incomeList"
        :key="item.id"
        class="mb-2 p-2 border rounded"
      >
        <p>📆 {{ item.date }}</p>
        <p>💬 {{ item.description }}</p>
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <p>🏷️ {{ item.category }}</p>
      </li>
    </ul>
    <p v-else>선택된 날짜에 수입 내역이 없습니다.</p>
  </div>
</template>

<script setup>
import { watch, defineProps, getCurrentInstance } from 'vue';
// Import the combined store
import { useTransactionStore } from '../stores/TransactionStore'; // Adjust path

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

// Use the transaction store
const transactionStore = useTransactionStore();

const { emit } = getCurrentInstance();
// Watch the prop and trigger the specific store action
watch(
  () => props.selectedDate,
  async (newSelectedDate) => {
    if (newSelectedDate) {
      await transactionStore.fetchIncome(newSelectedDate);
      emit('income-loaded', transactionStore.incomeList);
    }
  },
  { immediate: true }
);
</script>
