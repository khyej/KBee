<template>
  <div class="p-10 bg-gray-100 min-h-screen space-y-10 flex justify-center">
    <div class="w-full max-w-screen-xl space-y-10">
      <!-- 수입 / 지출 / 잔액 카드 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="bg-white p-4 py-8 rounded-xl shadow text-center border border-gray-300"
        >
          <p class="text-gray-500 text-sm">총 수입</p>
          <p class="text-2xl font-bold text-green-500">
            +{{ totalIncome.toLocaleString() }}원
          </p>
        </div>
        <div
          class="bg-white p-4 py-8 rounded-xl shadow text-center border border-gray-300"
        >
          <p class="text-gray-500 text-sm">총 지출</p>
          <p class="text-2xl font-bold text-red-500">
            -{{ totalExpense.toLocaleString() }}원
          </p>
        </div>
        <div
          class="bg-white p-4 py-8 rounded-xl shadow text-center border border-gray-300"
        >
          <p class="text-gray-500 text-sm">잔액</p>
          <p
            class="text-2xl font-bold"
            :class="balance >= 0 ? 'text-blue-500' : 'text-red-500'"
          >
            {{ balance >= 0 ? '+' : '' }}{{ balance.toLocaleString() }}원
          </p>
        </div>
      </div>

      <!-- 그래프 영역 -->
      <div class="flex flex-col md:flex-row justify-start items-start gap-8">
        <!-- 파이 그래프 -->
        <div
          class="bg-white rounded-xl shadow p-4 w-full md:w-[600px] h-[400px]"
        >
          <h2 class="text-center font-semibold mb-2">파이 그래프</h2>
          <PieChart />
        </div>

        <!-- 막대 그래프 -->
        <div
          class="bg-white rounded-xl shadow p-4 w-full md:w-[600px] h-[400px]"
        >
          <h2 class="text-center font-semibold mb-2">막대 그래프</h2>
          <BarChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import { ref, onMounted } from 'vue';

const totalIncome = ref(0);
const totalExpense = ref(0);
const balance = ref(0);

onMounted(async () => {
  const [incomeRes, expenseRes] = await Promise.all([
    fetch('http://localhost:3000/incomes'),
    fetch('http://localhost:3000/expenses'),
  ]);

  const incomes = await incomeRes.json();
  const expenses = await expenseRes.json();

  totalIncome.value = incomes.reduce((sum, item) => sum + item.amount, 0);
  totalExpense.value = expenses.reduce((sum, item) => sum + item.amount, 0);
  balance.value = totalIncome.value - totalExpense.value;
});
</script>
