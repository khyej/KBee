<template>
  <div class="wrap">
    <div class="subBox">
      <div class="px-4">
        <!-- 제목과 월 선택 -->
        <div class="bg-white rounded-xl shadow p-4 mb-6 w-full">
          <!-- 💡 template 부분 수정 -->
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-xl text-gray-800">
              {{ selectedYear }}년 {{ selectedMonth }}월 가계부
            </h3>
            <div class="flex items-center gap-2">
              <label class="text-gray-700 font-semibold">연도 선택:</label>
              <select
                v-model="selectedYear"
                class="border px-3 py-1 rounded-md shadow-sm text-gray-700 text-sm"
              >
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}년
                </option>
              </select>

              <label class="text-gray-700 font-semibold">월 선택:</label>
              <select
                v-model="selectedMonth"
                class="border px-3 py-1 rounded-md shadow-sm text-gray-700 text-sm"
              >
                <option
                  v-for="month in months"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 전체 레이아웃 -->
        <div class="w-full flex flex-col md:flex-row gap-10 md:items-stretch">
          <!-- 좌측: 수입/지출 및 바차트 -->
          <div class="flex flex-col gap-4 w-full md:w-1/2 flex-1">
            <!-- 수입/지출/잔액 박스: 가로 정렬 -->
            <div
              class="flex flex-col md:flex-row gap-4 w-full h-full text-center"
            >
              <!-- 수입 박스 -->
              <div
                class="flex-1 bg-white px-4 py-6 shadow border-b-2 border-blue-200 flex flex-col items-center justify-center"
              >
                <p class="text-gray-500 text-sm mb-1">
                  {{ selectedMonth }}월 수입
                </p>
                <p class="text-2xl font-semibold text-green-600">
                  +<AnimatedNumber :to="monthIncome" />원
                </p>
              </div>

              <!-- 지출 박스 -->
              <div
                class="flex-1 bg-white px-4 py-6 shadow border-b-2 border-blue-200 flex flex-col items-center justify-center"
              >
                <p class="text-gray-500 text-sm mb-1">
                  {{ selectedMonth }}월 지출
                </p>
                <p class="text-2xl font-semibold text-red-600">
                  -<AnimatedNumber :to="monthExpense" />원
                </p>
              </div>

              <!-- 잔액 박스 -->
              <div
                class="flex-1 bg-white px-4 py-6 shadow border-b-2 border-blue-200 flex flex-col items-center justify-center"
              >
                <p class="text-gray-500 text-sm mb-1">
                  {{ selectedMonth }}월 잔액
                </p>
                <p class="text-2xl font-semibold text-blue-600">
                  <AnimatedNumber :to="balance" />원
                </p>
              </div>
            </div>

            <!-- 바 차트 -->
            <div
              class="bg-white rounded-xl shadow p-4 h-full flex-1 flex flex-col justify-between"
            >
              <h2 class="text-center font-semibold mb-2">
                {{ selectedYear }}년 지출 및 수입
              </h2>
              <div class="flex-1 flex items-center justify-center">
                <div
                  v-if="monthIncome === 0 && monthExpense === 0"
                  class="text-gray-400 text-center"
                >
                  데이터가 없습니다.
                </div>
                <div v-else class="w-full h-full">
                  <BarChart :month="selectedMonth" />
                </div>
              </div>
            </div>
          </div>

          <!-- 우측: 파이차트와 지출 TOP5 -->
          <div class="flex flex-col gap-4 w-full md:w-1/2 flex-1">
            <div
              class="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between"
            >
              <h2 class="text-center font-semibold text-base md:text-lg mb-4">
                카테고리별 지출
              </h2>
              <div class="flex-1 flex items-center justify-center">
                <div class="min-w-[300px] max-w-full mx-auto w-full h-full">
                  <PieChart :month="selectedMonth" />
                </div>
              </div>
            </div>

            <!-- 지출 TOP 5 -->
            <div class="bg-white rounded-xl shadow p-4">
              <h2 class="text-lg font-semibold mb-3 text-left">지출 TOP 5</h2>
              <div
                v-if="topExpenses.length === 0"
                class="text-center text-gray-400 py-8"
              >
                데이터가 없습니다.
              </div>
              <div v-else class="grid grid-rows-3 grid-flow-col gap-4">
                <div
                  v-for="(item, index) in topExpenses"
                  :key="index"
                  class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm flex flex-col justify-between"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">
                      🥇 {{ index + 1 }}위
                    </span>
                    <span class="text-red-500 font-semibold text-sm">
                      {{ item.amount.toLocaleString() }}원
                    </span>
                  </div>
                  <div class="mt-2 text-base font-bold text-gray-800 truncate">
                    {{ item.category }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const selectedYear = ref('2025'); // ✅ 연도 선택 추가
const selectedMonth = ref('04');

const years = ['2023', '2024', '2025', '2026', '2027']; // ✅ 연도 옵션 리스트
const months = Array.from({ length: 12 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return { label: `${i + 1}월`, value: num };
});

const incomes = ref([]);
const expenses = ref([]);
const monthIncome = ref(0);
const monthExpense = ref(0);
const topExpenses = ref([]);

const getYear = (dateStr) => dateStr.split('-')[0];
const getMonth = (dateStr) => dateStr.split('-')[1];

const userBudget = ref(0);
const balance = ref(0);

const fetchData = async () => {
  try {
    const [incomeRes, expenseRes] = await Promise.all([
      axios.get('/api/incomes'),
      axios.get('/api/expenses'),
    ]);
    incomes.value = incomeRes.data.map((i) => ({ ...i, type: 'income' }));
    expenses.value = expenseRes.data.map((e) => ({ ...e, type: 'expense' }));
    updateFilteredData();
  } catch (err) {
    console.error('❌ 데이터 로드 실패:', err);
  }
};

const updateFilteredData = () => {
  const userId = userStore.user?.id;
  if (!userId) return;

  const filteredIncomes = incomes.value.filter(
    (item) =>
      item.user_id === userId &&
      getYear(item.date) === selectedYear.value &&
      getMonth(item.date) === selectedMonth.value
  );
  const filteredExpenses = expenses.value.filter(
    (item) =>
      item.user_id === userId &&
      getYear(item.date) === selectedYear.value &&
      getMonth(item.date) === selectedMonth.value
  );

  monthIncome.value = filteredIncomes.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  monthExpense.value = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const userData = userStore.user;
  userBudget.value = Number(userData?.budget || 0);
  balance.value = userBudget.value - monthExpense.value;

  const categorySums = filteredExpenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});

  topExpenses.value = Object.entries(categorySums)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);
};

onMounted(async () => {
  await userStore.restoreUser();
  await userStore.fetchUser();
  await fetchData();
});

watch([selectedYear, selectedMonth], updateFilteredData);
</script>
