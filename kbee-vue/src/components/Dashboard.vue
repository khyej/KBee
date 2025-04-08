<template>
  <div class="bg-gray-100 min-h-screen py-10">
    <!-- 🔘 월 선택 드롭다운 -->
    <div class="text-center mb-6">
      <label class="mr-2 text-gray-700 font-semibold">월 선택:</label>
      <select
        v-model="selectedMonth"
        class="border px-3 py-1 rounded-md shadow-sm text-gray-700"
      >
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </div>

    <!-- 📌 상단 제목 -->
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
      2025년 {{ selectedMonth }}월 가계부
    </h2>

    <div class="flex justify-center">
      <div class="max-w-screen-xl w-full flex md:flex-row gap-10 px-4">
        <!-- 수입/지출 영역 -->
        <div class="flex flex-col gap-10 w-full">
          <!-- 수입 -->
          <div
            class="bg-white px-6 py-10 shadow text-center border-b-2 border-green-200"
          >
            <p class="text-gray-500 text-sm">{{ selectedMonth }}월 수입</p>
            <p class="text-2xl font-semibold text-green-600">
              +{{ aprilIncome.toLocaleString() }}원
            </p>
          </div>

          <!-- 지출 -->
          <div
            class="bg-white px-6 py-10 shadow text-center border-b-2 border-red-200"
          >
            <p class="text-gray-500 text-sm">{{ selectedMonth }}월 지출</p>
            <p class="text-2xl font-semibold text-red-600">
              -{{ aprilExpense.toLocaleString() }}원
            </p>
          </div>

          <!-- 막대 그래프 -->
          <div class="bar bg-white rounded-xl shadow p-4">
            <h2 class="text-center font-semibold mb-2">막대 그래프</h2>
            <BarChart :month="selectedMonth" />
          </div>
        </div>

        <!-- 오른쪽 영역 -->
        <div class="flex flex-col gap-10">
          <div class="bg-white rounded-xl shadow p-4 w-full">
            <h2 class="text-center font-semibold mb-2">월별 지출</h2>
            <PieChart :month="selectedMonth" />
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
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';

const selectedMonth = ref('04');
const aprilIncome = ref(0);
const aprilExpense = ref(0);
const topExpenses = ref([]);

const months = [
  { label: '1월', value: '01' },
  { label: '2월', value: '02' },
  { label: '3월', value: '03' },
  { label: '4월', value: '04' },
  { label: '5월', value: '05' },
  { label: '6월', value: '06' },
  { label: '7월', value: '07' },
  { label: '8월', value: '08' },
  { label: '9월', value: '09' },
  { label: '10월', value: '10' },
  { label: '11월', value: '11' },
  { label: '12월', value: '12' },
];

const fetchData = async () => {
  try {
    const [incomeRes, expenseRes] = await Promise.all([
      axios.get('/api/incomes'),
      axios.get('/api/expenses'),
    ]);

    const incomes = incomeRes.data;
    const expenses = expenseRes.data;

    const getMonth = (dateStr) => dateStr.split('-')[1];

    const filteredIncomes = incomes.filter(
      (item) => getMonth(item.date) === selectedMonth.value
    );
    const filteredExpenses = expenses.filter(
      (item) => getMonth(item.date) === selectedMonth.value
    );

    aprilIncome.value = filteredIncomes.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    aprilExpense.value = filteredExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const categorySums = filteredExpenses.reduce((acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
      return acc;
    }, {});

    topExpenses.value = Object.entries(categorySums)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  } catch (error) {
    console.error('❌ 데이터 로딩 실패:', error);
  }
};

onMounted(fetchData);
watch(selectedMonth, fetchData);
</script>
