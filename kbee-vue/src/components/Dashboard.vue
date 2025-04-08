<template>
  <div class="bg-gray-100 min-h-screen flex justify-center py-10">
    <div class="max-w-screen-xl w-full flex md:flex-row gap-10 px-4">
      <!-- 수입/지출 영역 -->
      <div class="flex flex-col gap-10 w-full">
        <!-- 4월 수입 -->
        <div
          class="bg-white px-6 py-10 shadow text-center border-b-2 border-green-200"
        >
          <p class="text-gray-500 text-sm">4월 수입</p>
          <p class="text-2xl font-semibold text-green-600">
            +{{ aprilIncome.toLocaleString() }}원
          </p>
        </div>

        <!-- 4월 지출 -->
        <div
          class="bg-white px-6 py-10 shadow text-center border-b-2 border-red-200"
        >
          <p class="text-gray-500 text-sm">4월 지출</p>
          <p class="text-2xl font-semibold text-red-600">
            -{{ aprilExpense.toLocaleString() }}원
          </p>
        </div>

        <!-- 막대 그래프 -->
        <div class="bar bg-white rounded-xl shadow p-4">
          <h2 class="text-center font-semibold mb-2">막대 그래프</h2>
          <BarChart />
        </div>
      </div>

      <!-- 오른쪽 영역 -->
      <div class="flex flex-col gap-10">
        <div class="bg-white rounded-xl shadow p-4 w-full">
          <h2 class="text-center font-semibold mb-2">월별 지출</h2>
          <PieChart />
        </div>

        <!-- 지출 TOP 5 -->
        <div class="pl-6 border-l">
          <h2 class="text-lg font-semibold mb-2">지출 TOP 5</h2>
          <ul class="text-sm space-y-1">
            <li
              v-for="(item, index) in topExpenses"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ item.category }}</span>
              <span class="text-red-500 font-medium">
                {{ item.amount.toLocaleString() }}원
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import { ref, onMounted } from 'vue';

const totalIncome = ref(0);
const totalExpense = ref(0);
const aprilIncome = ref(0);
const aprilExpense = ref(0);
const topExpenses = ref([]);

onMounted(async () => {
  try {
    const [incomeRes, expenseRes] = await Promise.all([
      axios.get('/api/incomes'),
      axios.get('/api/expenses'),
    ]);

    const incomes = incomeRes.data;
    const expenses = expenseRes.data;

    // 전체 총합 계산
    totalIncome.value = incomes.reduce((sum, item) => sum + item.amount, 0);
    totalExpense.value = expenses.reduce((sum, item) => sum + item.amount, 0);

    // 월 추출 함수: 'YYYY-MM-DD' → '04'
    const getMonth = (dateStr) => dateStr.split('-')[1];

    // 4월 필터링 (문자열로 '04')
    const aprilIncomes = incomes.filter((item) => getMonth(item.date) === '04');
    const aprilExpenses = expenses.filter(
      (item) => getMonth(item.date) === '04'
    );

    // 4월 수입/지출 합계
    aprilIncome.value = aprilIncomes.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    aprilExpense.value = aprilExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // 4월 지출 TOP5 (카테고리별 합산 후 정렬)
    const categorySums = aprilExpenses.reduce((acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
      return acc;
    }, {});

    topExpenses.value = Object.entries(categorySums)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error);
  }
});
</script>

<style scoped></style>
