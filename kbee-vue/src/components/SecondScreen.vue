<template>
  <div class="wrapper">
    <div class="main">
      <div class="scroll-container">
        <!-- 선택된 날짜 표시 (예: 2025년 4월 10일) -->
        <p>{{ formattedSelectedDateForDisplay }}</p>
        <hr />

        <!-- 자식 컴포넌트(숨김 상태)에서 데이터 로드만 유도 -->
        <Income style="display: none" @income-loaded="handleIncomeLoaded" :selectedDate="selectedDate" />
        <Expense style="display: none" @expense-loaded="handleExpenseLoaded" :selectedDate="selectedDate" />

        <!-- 수입 내역 표시 -->
        <div v-if="filteredParentIncomeList.length > 0">
          <h2 class="subtitle">수입</h2>
          <ul>
            <li v-for="item in filteredParentIncomeList" :key="item.id" class="income-item">
              {{ item.description }}
              <span class="amount plus">
                + {{ item.amount.toLocaleString() }}원
              </span>
            </li>
          </ul>
        </div>

        <!-- 지출 내역 표시 -->
        <div v-if="filteredParentExpenseList.length > 0">
          <h2 class="subtitle">지출</h2>
          <ul>
            <li v-for="item in filteredParentExpenseList" :key="item.id" class="expense-item">
              {{ item.description }}
              <span class="amount minus">
                - {{ item.amount.toLocaleString() }}원
              </span>
            </li>
          </ul>
        </div>

        <!-- 아무 데이터도 없을 때 표시 -->
        <div v-if="
          !filteredParentIncomeList.length &&
          !filteredParentExpenseList.length
        ">
          <p>해당 날짜에는 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 기본 Vue API
import { ref, defineProps, computed } from 'vue';

// 자식 컴포넌트 (실제 UI는 숨겨놓고 데이터만 로드)
import Income from './Income.vue';
import Expense from './Expense.vue';

// 로그인한 사용자 정보 Store
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

// 부모 컴포넌트에서 전달받은 선택된 날짜 (예: '10월 26, 2023')
const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

// 자식 컴포넌트로부터 받은 원본 수입/지출 내역 저장
const parentIncomeList = ref([]);
const parentExpenseList = ref([]);

// 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환
const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const convertToYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.replace(',', '').split(' ').filter((part) => part);
  if (parts.length < 3) return null;

  const [monthStr, dayStr, yearStr] = parts;
  const monthIndex = monthNames.indexOf(monthStr);
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  if (monthIndex === -1 || isNaN(day) || isNaN(year)) return null;

  const month = (monthIndex + 1).toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  return `${year}-${month}-${formattedDay}`;
};

// 변환된 날짜 값을 계산
const targetDateYYYYMMDD = computed(() => convertToYYYYMMDD(props.selectedDate));

// 자식 컴포넌트에서 emit된 수입 데이터를 저장
const handleIncomeLoaded = (incomeData) => {
  parentIncomeList.value = incomeData || [];
};

// 자식 컴포넌트에서 emit된 지출 데이터를 저장
const handleExpenseLoaded = (expenseData) => {
  parentExpenseList.value = expenseData || [];
};

// 로그인된 유저 + 해당 날짜 기준 수입 필터링
const filteredParentIncomeList = computed(() => {
  const targetDate = targetDateYYYYMMDD.value;
  if (!userStore.user?.id || !targetDate) return [];
  return parentIncomeList.value.filter(
    (item) => item.user_id === userStore.user.id && item.date === targetDate
  );
});

// 로그인된 유저 + 해당 날짜 기준 지출 필터링
const filteredParentExpenseList = computed(() => {
  const targetDate = targetDateYYYYMMDD.value;
  if (!userStore.user?.id || !targetDate) return [];
  return parentExpenseList.value.filter(
    (item) => item.user_id === userStore.user.id && item.date === targetDate
  );
});

// 화면에 표시용으로 날짜 포맷 변환 ("YYYY년 M월 D일")
const formattedSelectedDateForDisplay = computed(() => {
  if (!props.selectedDate) return '날짜를 선택해주세요';
  const yyyyMMdd = convertToYYYYMMDD(props.selectedDate);
  if (!yyyyMMdd) return props.selectedDate;
  const [year, month, day] = yyyyMMdd.split('-');
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
});

// 카테고리별 아이콘 반환 (향후 확장 가능)
const getIcon = (category) => {
  switch (category) {
    case '식비': return ['fas', 'utensils'];
    case '쇼핑': return ['fas', 'shopping-cart'];
    case '통신비': return ['fas', 'wifi'];
    case '교통': return ['fas', 'subway'];
    case '프리랜서':
    case '투자 수익':
    case '급여': return ['fas', 'piggy-bank'];
    case '문화생활': return ['fas', 'gift'];
    case '카페/디저트': return ['fas', 'coffee'];
    case '의료/건강': return ['fas', 'clinic-medical'];
    case '공과금': return ['fas', 'credit-card'];
    case '이자': return ['fas', 'money-check-alt'];
    default: return ['fas', 'money-check-alt'];
  }
};
</script>

<style scoped>
/* 최상위 레이아웃 wrapper */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 40px 40px;
  min-height: 100vh;
}

/* 콘텐츠 박스 */
.main {
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  text-align: center;

  height: 630px;
  max-height: 770px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 수입/지출 아이템 공통 스타일 */
.income-item,
.expense-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 수입 표시용 원형 아이콘 */
.income-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
}

/* 지출 표시용 원형 아이콘 */
.expense-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}

/* 구분선 */
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 16px 0;
}

/* 소제목 */
.subtitle {
  margin-bottom: 25px;
  margin-top: 24px;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left;
}

/* 리스트 스타일 제거 */
ul {
  list-style: none;
  padding: 0;
}

/* 금액 표시 스타일 */
.amount {
  font-weight: bold;
  white-space: nowrap;
}

.plus {
  color: #2e7d32;
}

.minus {
  color: #c62828;
}

/* 스크롤 영역 */
.scroll-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(800px - 64px);
  padding-right: 4px;
}
</style>
