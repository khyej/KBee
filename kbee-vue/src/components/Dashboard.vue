<template>
  <!--전체 배경을 설정-->
  <div class="wrap">
    <!--박스를 한개 더 씌워서 카드 형태를 굳히기-->
    <div class="subBox">
      <!-- 제목과 월 선택 스타일 블록-->
      <div class="bg-white rounded-xl shadow p-4 mb-6 w-full">
        <!--헤더 블록-->
        <div class="flex justify-between items-center">
          <!--제목-->
          <h3 class="font-bold text-xl text-gray-800">
            {{ selectedYear }}년 {{ selectedMonth }}월 가계부
          </h3>
          <!--제목-->

          <!--연도 월 선택 블록-->
          <div class="flex items-center gap-2">
            <!--선택한 연도를 받아오기 위해 바인딩 사용(실시간 반영을 위해서)-->
            <label class="text-gray-700 font-semibold">연도 선택:</label>
            <select
              v-model="selectedYear"
              class="border px-3 py-1 rounded-md shadow-sm text-gray-700 text-sm"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}년
              </option>
            </select>

            <!--선택한 월을 받아오기 위해 바인딩 사용(실시간 반영을 위해서)-->
            <label class="text-gray-700 font-semibold">월 선택:</label>
            <select
              v-model="selectedMonth"
              class="border px-3 py-1 rounded-md shadow-sm text-gray-700 text-sm"
            >
              <!--월 배열에 있는 요소들을 돌려서 달을 찾기-->
              <option
                v-for="month in months"
                :key="month.value"
                :value="month.value"
              >
                {{ month.label }}
              </option>
            </select>
            <!--월 배열에 있는 요소들을 돌려서 달을 찾기-->
          </div>
          <!--연도 월 선택 블록-->
        </div>
        <!--헤더 블록-->
      </div>
      <!-- 제목과 월 선택 스타일 블록-->

      <!-- 전체 레이아웃 -->
      <div class="w-full flex flex-col xl:flex-row gap-10 xl:items-stretch">
        <!-- 좌측: 수입/지출 및 바차트 -->
        <div class="flex flex-col gap-4 w-full xl:w-1/2 flex-1">
          <!-- 수입/지출/잔액 박스: 가로 정렬 -->
          <div
            class="flex flex-col xl:flex-row gap-4 w-full h-full text-center"
          >
            <!-- 수입 박스 -->
            <div
              class="flex-1 rounded-xl bg-white px-4 py-6 shadow border-b-2 border-green-200 flex flex-col items-center justify-center"
            >
              <p class="text-gray-500 text-sm mb-1">
                {{ selectedMonth }}월 수입
              </p>
              <p class="text-2xl font-semibold text-green-600">
                +<AnimatedNumber :to="monthIncome" />원
              </p>
            </div>
            <!-- 수입 박스 -->

            <!-- 지출 박스 -->
            <div
              class="flex-1 rounded-xl bg-white px-4 py-6 shadow border-b-2 border-red-200 flex flex-col items-center justify-center"
            >
              <p class="text-gray-500 text-sm mb-1">
                {{ selectedMonth }}월 지출
              </p>
              <p class="text-2xl font-semibold text-red-600">
                -<AnimatedNumber :to="monthExpense" />원
              </p>
            </div>
            <!-- 지출 박스 -->

            <!-- 잔액 박스 -->
            <div
              class="flex-1 rounded-xl bg-white px-4 py-6 shadow border-b-2 border-blue-200 flex flex-col items-center justify-center"
            >
              <p class="text-gray-500 text-sm mb-1">
                {{ selectedMonth }}월 예산
              </p>
              <p class="text-2xl font-semibold text-blue-600">
                <AnimatedNumber :to="balance" />원
              </p>
            </div>
          </div>
          <!-- 잔액 박스 -->

          <!--막대그래프-->
          <div
            class="bg-white rounded-xl shadow p-4 h-full flex-1 flex flex-col justify-between"
          >
            <!--헤더에서 선택한 연도 대입-->
            <h2 class="text-center font-semibold mb-2">
              {{ selectedYear }}년 지출 및 수입
            </h2>
            <!--그래프를 중앙에 정렬 및 크기를 부모의 크기에 따라가기-->
            <div class="flex-1 flex items-center justify-center">
              <div
                v-if="monthIncome === 0 && monthExpense === 0"
                class="text-gray-400 text-center"
              >
                데이터가 없습니다.
              </div>
              <!--헤더에서 선택한 연도의 막대그래프 생성-->
              <div v-else class="w-full h-full">
                <BarChart :month="selectedMonth" />
              </div>
              <!--헤더에서 선택한 연도의 막대그래프 생성-->
            </div>
            <!--그래프를 중앙에 정렬 및 크기를 부모의 크기에 따라가기-->
          </div>
        </div>
        <!-- 좌측: 수입/지출 및 바차트 -->

        <!-- 우측: 파이차트와 지출 TOP5(우측 같은 라인으로 크기 관리하기 위해 같은 div에 묶음) -->
        <div class="flex flex-col gap-4 w-full xl:w-1/2 flex-1">
          <div
            class="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between"
          >
            <h2 class="text-center font-semibold text-base xl:text-lg mb-4">
              카테고리별 지출
            </h2>
            <div class="flex-1 flex items-center justify-center">
              <div v-if="monthExpense === 0" class="text-gray-400 text-center">
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
            <!--데이터가 없을 경우 즉 지출 top6의 배열의 개수가 0일때-->
            <div
              v-if="topExpenses.length === 0"
              class="text-center text-gray-400 py-8"
            >
              <!--데이터가 없다는 문자열을 출력-->
              데이터가 없습니다.
            </div>

            <!--있을 경우에는 세개의 행을 만들고 갭을 4px정도를 준다-->
            <div v-else class="grid grid-rows-3 grid-flow-col gap-4">
              <!--스크립트에서 지출 top6 배열을 받아오기-->
              <div
                v-for="(item, index) in topExpenses"
                :key="index"
                class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm flex flex-col justify-between"
              >
                <!--정렬이 되어서 넘어왔으므로 인덱스에 +1만 해서 순위 
                  메기기(시작 인덱스가 0이라 +1)-->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-600">
                    🥇 {{ index + 1 }}위
                  </span>
                  <!--화면에 출력을 위해 카테고리별 지출 총계를 문자열로 변환-->
                  <span class="text-red-500 font-semibold text-sm">
                    {{ item.amount.toLocaleString() }}원
                  </span>
                </div>
                <!--순위에 해당하는 카테고리 출력 및 아이콘 새기기-->
                <div class="mt-2 text-base font-bold text-gray-800 truncate">
                  <font-awesome-icon :icon="getIcon(item.category)" />
                  {{ item.category }}
                </div>
                <!--순위에 해당하는 카테고리 출력 및 아이콘 새기기-->
              </div>
              <!--스크립트에서 지출 top6 배열을 받아오기-->
            </div>
            <!--있을 경우에는 세개의 행을 만들고 갭을 4px정도를 준다-->
          </div>
          <!-- 지출 TOP 5 -->
        </div>
        <!-- 우측: 파이차트와 지출 TOP5(우측 같은 라인으로 크기 관리하기 위해 같은 div에 묶음) -->
      </div>
      <!-- 전체 레이아웃 -->
    </div>
    <!--박스를 한개 더 씌워서 카드 형태를 굳히기-->
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

const incomes = ref([]); //수입 내역들의 배열
const expenses = ref([]); //지출 내역들의 배열
const monthIncome = ref(0); //월별 수입
const monthExpense = ref(0); //월별 지출
const topExpenses = ref([]); //지출 top6의 배열

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

  //유저 테이블에 있는 데이터를 userDate변수에 담기
  const userData = userStore.user;
  //유저 아이디에 해당하는 잔액을 업데이트
  userBudget.value = Number(userData?.budget || 0);
  //잔액에서 월별지출을 빼서 넘겨주기
  balance.value = userBudget.value - monthExpense.value;

  //카테고리별 지출 총계
  const categorySums = filteredExpenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});

  //지출목록 데이터 내림차순으로 정렬
  topExpenses.value = Object.entries(categorySums)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);
};
//아이콘
const getIcon = (category) => {
  switch (category) {
    case '식비':
      return ['fas', 'utensils'];
    case '쇼핑':
      return ['fas', 'shopping-cart'];
    case '통신비':
      return ['fas', 'wifi'];
    case '교통':
      return ['fas', 'subway'];
    case '프리랜서':
    case '투자 수익':
    case '급여':
      return ['fas', 'piggy-bank'];
    case '문화생활':
      return ['fas', 'gift'];
    case '카페/디저트':
      return ['fas', 'coffee'];
    case '의료/건강':
      return ['fas', 'clinic-medical'];
    case '공과금':
      return ['fas', 'credit-card'];
    case '이자':
      return ['fas', 'money-check-alt'];
    default:
      return ['fas', 'money-check-alt'];
  }
};
//유저스토어에서 json의 유저 데이터 받기
onMounted(async () => {
  await userStore.restoreUser();
  await userStore.fetchUser();
  await fetchData();
});

watch([selectedYear, selectedMonth], updateFilteredData);
</script>

<style scoped>
.wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  overflow: hidden;
}

.subBox {
  width: 100%;
  max-width: 1800px;
  height: calc(100% - 40px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 10px;
}
</style>
