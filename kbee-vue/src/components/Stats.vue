<template>
  <div class="bg-gray-100 min-h-screen flex justify-center py-10">
    <div class="max-w-screen-xl w-full flex md:flex-row gap-10 px-4">
      <!-- 수입/지출 영역: 왼쪽 (세로 정렬) -->
      <div class="flex flex-col gap-10 w-full">
        <!-- 총 수입 -->
        <div
          class="bg-white px-6 py-10 shadow text-center border-b-2 border-green-300"
        >
          <p class="text-gray-500 text-sm">총 수입</p>
          <p class="text-3xl font-bold text-green-500">
            +{{ totalIncome.toLocaleString() }}원
          </p>
        </div>

        <!-- 총 지출 -->
        <div
          class="bg-white px-6 py-10 shadow text-center border-b-2 border-red-300"
        >
          <p class="text-gray-500 text-sm">총 지출</p>
          <p class="text-3xl font-bold text-red-500">
            -{{ totalExpense.toLocaleString() }}원
          </p>
        </div>
        <br />
        <!--막대-->
        <div class="bar bg-white rounded-xl shadow p-4 w-full">
          <h2 class="text-center font-semibold mb-2">막대 그래프</h2>
          <BarChart />
        </div>
        <!-- 지출 TOP 5 -->
        <div class="w-1/3 pl-6 border-l">
          <h2 class="text-lg font-semibold mb-2">지출 TOP 5</h2>
          <ul class="text-sm space-y-1">
            <li
              v-for="(item, index) in topExpenses"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ item.category }}</span>
              <span class="text-red-500 font-medium"
                >{{ item.amount.toLocaleString() }}원</span
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- 그래프 영역: 오른쪽 -->
      <!-- 파이 그래프 -->
      <div class="bg-white rounded-xl shadow p-4 w-full">
        <h2 class="text-center font-semibold mb-2">파이 그래프</h2>
        <PieChart />
      </div>
      <br />
      <!-- 막대 그래프 -->
    </div>
  </div>
</template>

<script setup>
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import { ref, onMounted } from 'vue';

const totalIncome = ref(0);
const totalExpense = ref(0);
const topExpenses = ref([]);
onMounted(async () => {
  const [incomeRes, expenseRes] = await Promise.all([
    fetch('http://localhost:3000/incomes'),
    fetch('http://localhost:3000/expenses'),
  ]);

  const incomes = await incomeRes.json();
  const expenses = await expenseRes.json();

  totalIncome.value = incomes.reduce((sum, item) => sum + item.amount, 0);
  totalExpense.value = expenses.reduce((sum, item) => sum + item.amount, 0);

  topExpenses.value = expenses.sort((a, b) => b.amount - a.amount).slice(0, 5);
});
</script>

<style scoped>
div {
  width: 400px;
}
</style>
