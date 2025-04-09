<template>
  <div class="wrapper">
    <div class="main">
      <!-- <h2>Second Screen</h2>
    <h1 class="text-2xl font-bold">User ID: {{ userStore.user?.id }}</h1> -->
      <p>{{ formattedSelectedDate }}</p>
      <hr />
      <Income
        style="display: none"
        @income-loaded="handleIncomeLoaded"
        :selectedDate="selectedDate"
      />
      <Expense
        style="display: none"
        @expense-loaded="handleExpenseLoaded"
        :selectedDate="selectedDate"
      />
      <div v-if="filteredParentIncomeList.length > 0">
        <h2 class="subtitle">수입</h2>
        <ul>
          <li
            v-for="item in filteredParentIncomeList"
            :key="item.id"
            class="income-item"
          >
            {{ item.description }}
            <span class="amount plus">+ {{ item.amount }}원</span>
          </li>
        </ul>
      </div>
      <div v-if="filteredParentExpenseList.length > 0">
        <h2 class="subtitle">지출</h2>
        <ul>
          <li
            v-for="item in filteredParentExpenseList"
            :key="item.id"
            class="expense-item"
          >
            {{ item.description }}
            <span class="amount minus">- {{ item.amount }}원</span>
          </li>
        </ul>
      </div>
      <div
        v-if="
          !filteredParentIncomeList.length && !filteredParentExpenseList.length
        "
      >
        <p>해당 날짜에는 내역이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import Income from './Income.vue';
import Expense from './Expense.vue';
import { useUserStore } from '../stores/user';
import Hiya from './Hiya.vue';

const userStore = useUserStore();

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

const parentIncomeList = ref([]);
const parentExpenseList = ref([]);

const handleIncomeLoaded = (incomeData) => {
  parentIncomeList.value = incomeData;
};

const handleExpenseLoaded = (expenseData) => {
  parentExpenseList.value = expenseData;
};

const filteredParentIncomeList = computed(() => {
  if (!userStore.user?.id) {
    return [];
  }
  return parentIncomeList.value.filter(
    (item) => item.user_id === userStore.user.id
  );
});

const filteredParentExpenseList = computed(() => {
  if (!userStore.user?.id) {
    return [];
  }
  return parentExpenseList.value.filter(
    (item) => item.user_id === userStore.user.id
  );
});

const formattedSelectedDate = computed(() => {
  if (!props.selectedDate) return '';

  const regex = /^(\d{1,2})월 (\d{1,2}), (\d{4})$/;
  const match = props.selectedDate.match(regex);

  if (!match) return props.selectedDate;

  const [, month, day, year] = match;
  return `${year}년 ${month}월 ${day}일`;
});
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 40px 40px;
  background-color: #f4f4f4; /* 전체 배경 */
  min-height: 100vh;
}

.main {
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;

  height: 800px;
  overflow-y: auto;
}

.income-item,
.expense-item {
  position: relative;
  padding-left: 20px; /* 왼쪽 여백 확보 */
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

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

hr {
  border: none;
  border-top: 1px solid #ddd; /* 선 색상 설정 */
  margin: 16px 0; /* 위아래 간격 (선택사항) */
}

.subtitle {
  margin-bottom: 12px; /* 제목 아래 간격 */
  margin-top: 24px; /* 위쪽 간격 추가 (필요시) */
  font-size: 1.25rem;
  font-weight: bold;
}

.amount {
  font-weight: bold;
  margin-left: 8px;
}

.plus {
  color: #2e7d32; /* 진한 초록 */
}

.minus {
  color: #c62828; /* 진한 빨강 */
}
</style>
