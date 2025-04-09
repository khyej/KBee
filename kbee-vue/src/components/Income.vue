<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">💰 수입 내역</h3>
    <!-- Optional: Show loading/error states -->
    <div v-if="incomeStore.isLoading">Loading...</div>
    <div v-else-if="incomeStore.error" class="text-red-500">
      {{ incomeStore.error }}
    </div>
    <ul v-else-if="incomeStore.incomeList.length > 0">
      <li
        v-for="item in incomeStore.incomeList"
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
import { watch, defineProps } from 'vue';
import { useIncomeStore } from '../stores/IncomeStore'; // Adjust the path as necessary

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

const incomeStore = useIncomeStore();

// Watch the prop and trigger the store action
watch(
  () => props.selectedDate,
  (newSelectedDate) => {
    // Pass the original selectedDate string to the action
    incomeStore.fetchIncome(newSelectedDate);
  },
  { immediate: true } // Fetch data immediately when the component mounts
);

// No need for local incomeList, fetchIncome, convertToYYYYMMDD, or emit
// If you needed to notify a parent *specifically* when income loads
// (and the parent can't just watch the store), you might still emit,
// but often direct store access or watching the store state is preferred.
</script>
