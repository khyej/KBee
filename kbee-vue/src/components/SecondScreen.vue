<template>
  <div class="wrapper">
    <div class="main">
      <div class="scroll-container">
        <!-- Display formatted date -->
        <p>{{ formattedSelectedDateForDisplay }}</p>
        <!-- Display raw selected date prop (for debugging or context) -->
        <!-- <p>Raw Prop: {{ selectedDate }}</p> -->
        <hr />

        <!-- Hidden components still trigger fetching based on selectedDate -->
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

        <!-- Display Income List (filtered by user AND date within this component) -->
        <div v-if="filteredParentIncomeList.length > 0">
          <h2 class="subtitle">수입</h2>
          <ul>
            <li
              v-for="item in filteredParentIncomeList"
              :key="item.id"
              class="income-item"
            >
              {{ item.description }}
              <span class="amount plus"
                >+ {{ item.amount.toLocaleString() }}원</span
              >
              <!-- Optionally show date if needed for verification -->
              <!-- <span class="text-xs text-gray-500 block">{{ item.date }}</span> -->
            </li>
          </ul>
        </div>

        <!-- Display Expense List (filtered by user AND date within this component) -->
        <div v-if="filteredParentExpenseList.length > 0">
          <h2 class="subtitle">지출</h2>
          <ul>
            <li
              v-for="item in filteredParentExpenseList"
              :key="item.id"
              class="expense-item"
            >
              {{ item.description }}
              <span class="amount minus"
                >- {{ item.amount.toLocaleString() }}원</span
              >
              <!-- Optionally show date if needed for verification -->
              <!-- <span class="text-xs text-gray-500 block">{{ item.date }}</span> -->
            </li>
          </ul>
        </div>

        <!-- No Data Message -->
        <div
          v-if="
            !filteredParentIncomeList.length &&
            !filteredParentExpenseList.length
          "
        >
          <p>해당 날짜에는 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import Income from './Income.vue';
import Expense from './Expense.vue';
import { useUserStore } from '../stores/user';
// Removed unused import: import Hiya from './Hiya.vue';

const userStore = useUserStore();

const props = defineProps({
  selectedDate: {
    // Expects format like "10월 26, 2023"
    type: String,
    default: null,
  },
});

// Local state to hold data emitted from hidden children
const parentIncomeList = ref([]);
const parentExpenseList = ref([]);

// --- Helper for Date Conversion ---
// (Similar logic to TransactionStore's convertToYYYYMMDD)
const monthNames = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const convertToYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr
    .replace(',', '')
    .split(' ')
    .filter((part) => part);
  if (parts.length < 3) return null; // Basic validation

  const [monthStr, dayStr, yearStr] = parts;
  const monthIndex = monthNames.indexOf(monthStr);
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  if (monthIndex === -1 || isNaN(day) || isNaN(year)) return null;

  const month = (monthIndex + 1).toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  return `${year}-${month}-${formattedDay}`; // Returns "YYYY-MM-DD"
};

// Computed property to get the target date in "YYYY-MM-DD" format for filtering
const targetDateYYYYMMDD = computed(() => {
  return convertToYYYYMMDD(props.selectedDate);
});
// --- End Helper ---

const handleIncomeLoaded = (incomeData) => {
  // Store the raw list received (which should already be for the selected day from the store)
  parentIncomeList.value = incomeData || [];
};

const handleExpenseLoaded = (expenseData) => {
  // Store the raw list received
  parentExpenseList.value = expenseData || [];
};

// Computed property to filter the local income list by USER and DATE
const filteredParentIncomeList = computed(() => {
  const targetDate = targetDateYYYYMMDD.value; // Get "YYYY-MM-DD" format
  if (!userStore.user?.id || !targetDate) {
    return []; // Return empty if no user or no valid target date
  }
  // Filter the list stored locally by user_id AND the specific date
  return parentIncomeList.value.filter(
    (item) => item.user_id === userStore.user.id && item.date === targetDate
  );
});

// Computed property to filter the local expense list by USER and DATE
const filteredParentExpenseList = computed(() => {
  const targetDate = targetDateYYYYMMDD.value; // Get "YYYY-MM-DD" format
  if (!userStore.user?.id || !targetDate) {
    return []; // Return empty if no user or no valid target date
  }
  // Filter the list stored locally by user_id AND the specific date
  return parentExpenseList.value.filter(
    (item) => item.user_id === userStore.user.id && item.date === targetDate
  );
});

// Computed property to format the selectedDate prop for display purposes
const formattedSelectedDateForDisplay = computed(() => {
  if (!props.selectedDate) return '날짜를 선택해주세요'; // Default message

  // Use the conversion function, but format differently for display
  const yyyyMMdd = convertToYYYYMMDD(props.selectedDate);
  if (!yyyyMMdd) return props.selectedDate; // Fallback if conversion fails

  const [year, month, day] = yyyyMMdd.split('-');
  // Format to "YYYY년 MM월 DD일"
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
});
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
</script>

<style scoped>
/* Styles remain the same */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 40px 40px;
  /* 전체 배경 */
  min-height: 100vh;
}

.main {
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  text-align: center;

  height: 630px;
  max-height: 770px;
  /* 스크롤 제거 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.income-item,
.expense-item {
  position: relative;
  padding-left: 20px;
  /* 왼쪽 여백 확보 */
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left; /* Align text left for better readability */
  display: flex; /* Use flexbox for alignment */
  justify-content: space-between; /* Space out description and amount */
  align-items: center; /* Vertically center items */
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
  border-top: 1px solid #ddd;
  /* 선 색상 설정 */
  margin: 16px 0;
  /* 위아래 간격 (선택사항) */
}

.subtitle {
  margin-bottom: 25px;
  /* 제목 아래 간격 */
  margin-top: 24px;
  /* 위쪽 간격 추가 (필요시) */
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left; /* Align subtitle left */
}

ul {
  list-style: none; /* Remove default list bullets */
  padding: 0; /* Remove default padding */
}

.amount {
  font-weight: bold;
  /* margin-left: 8px; Removed margin as flexbox handles spacing */
  white-space: nowrap; /* Prevent amount from wrapping */
}

.plus {
  color: #2e7d32;
  /* 진한 초록 */
}

.minus {
  color: #c62828;
  /* 진한 빨강 */
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(800px - 64px);
  padding-right: 4px; /* 스크롤바 영역 여유 */
}
</style>
