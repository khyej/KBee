<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">💸 지출 내역</h3>
    <!-- Use the specific loading/error states from the transaction store -->
    <div v-if="transactionStore.isExpenseLoading">Loading...</div>
    <div v-else-if="transactionStore.expenseError" class="text-red-500">
      {{ transactionStore.expenseError }}
    </div>
    <ul v-else-if="transactionStore.expenseList.length > 0">
      <li
        v-for="item in transactionStore.expenseList"
        :key="item.id"
        class="mb-2 p-2 border rounded"
      >
        <p>📆 {{ item.date }}</p>
        <p>💬 {{ item.description }}</p>
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <p>🏷️ {{ item.category }} / 💳 {{ item.payment_method }}</p>
      </li>
    </ul>
    <p v-else>선택된 날짜에 지출 내역이 없습니다.</p>
  </div>
</template>

<script setup>
import { watch, defineProps, defineEmits } from 'vue';
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

const emit = defineEmits(['expense-loaded']);
// Watch the prop and trigger the specific store action
watch(
  () => props.selectedDate,
  async (newSelectedDate) => {
    if (newSelectedDate) {
      await transactionStore.fetchExpense(newSelectedDate);
      emit('expense-loaded', transactionStore.expenseList);
    }
  },
  { immediate: true }
);
</script>
