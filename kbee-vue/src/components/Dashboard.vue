<template>
  <div class="wrap">
    <div class="subBox">
      <div class="px-4">
        <!-- 제목과 월 선택 -->
        <div class="bg-white rounded-xl shadow p-4 mb-6 w-full">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-xl text-gray-800">
              2025년 {{ selectedMonth }}월 가계부
            </h3>
            <div class="flex items-center gap-2">
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
            <div
              class="bg-white px-6 py-10 shadow text-center border-b-2 border-green-200"
            >
              <p class="text-gray-500 text-sm">{{ selectedMonth }}월 수입</p>
              <p class="text-2xl font-semibold text-green-600">
                +<AnimatedNumber :to="aprilIncome" />원
              </p>
            </div>
            <div
              class="bg-white px-6 py-10 shadow text-center border-b-2 border-red-200"
            >
              <p class="text-gray-500 text-sm">{{ selectedMonth }}월 지출</p>
              <p class="text-2xl font-semibold text-red-600">
                -<AnimatedNumber :to="aprilExpense" />원
              </p>
            </div>
            <div
              class="bg-white rounded-xl shadow p-4 h-full flex-1 flex flex-col justify-between"
            >
              <h2 class="text-center font-semibold mb-2">
                {{ selectedMonth }}월 지출 및 수입
              </h2>
              <div class="flex-1 flex items-center justify-center">
                <div
                  v-if="aprilIncome === 0 && aprilExpense === 0"
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
                <div
                  v-if="aprilExpense === 0"
                  class="text-gray-400 text-center"
                >
                  데이터가 없습니다.
                </div>
                <div
                  v-else
                  class="min-w-[300px] max-w-full mx-auto w-full h-full"
                >
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

const selectedMonth = ref('04');
const months = Array.from({ length: 12 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return { label: `${i + 1}월`, value: num };
});

const incomes = ref([]);
const expenses = ref([]);
const aprilIncome = ref(0);
const aprilExpense = ref(0);
const topExpenses = ref([]);

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

const getMonth = (dateStr) => dateStr.split('-')[1];

const updateFilteredData = () => {
  const userId = userStore.user?.id;
  if (!userId) return;

  const filteredIncomes = incomes.value.filter(
    (item) =>
      item.user_id === userId && getMonth(item.date) === selectedMonth.value
  );
  const filteredExpenses = expenses.value.filter(
    (item) =>
      item.user_id === userId && getMonth(item.date) === selectedMonth.value
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
    .slice(0, 6);
};

onMounted(async () => {
  await userStore.restoreUser();
  await userStore.fetchUser();
  await fetchData();
});

watch(selectedMonth, updateFilteredData);
</script>

<style scoped>
.wrap {
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  overflow: hidden;
}

.subBox {
  background-color: #f3f4f6;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1800px;
  height: calc(100% - 40px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
