<template>
  <div class="wrapper">
    <div class="main">
      <div class="scroll-container">
        <!-- 선택된 날짜 표시 (예: 2025년 4월 10일) -->
        <p>{{ formattedSelectedDateForDisplay }}</p>
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
              @click="openDetailModal(item)"
              style="cursor: pointer"
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
              @click="openDetailModal(item)"
              style="cursor: pointer"
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

        <DetailModal
          class="body"
          :visible="showDetailModal"
          :selected-item="selectedItem"
          :income-categories="incomeCategories"
          :expense-categories="expenseCategories"
          customClass="cal"
          @close="closeModal"
          @delete="deleteItem"
          @save="saveEdit"
        />
      </div>
      <div class="addComponent">
        <!-- 항목 추가 모달 -->
        <AddModal
          :visible="showAddModal"
          :selected-format="targetDateYYYYMMDD"
          :income-categories="incomeCategories"
          :expense-categories="expenseCategories"
          @close="showAddModal = false"
          @submitted="handleItemSubmitted"
        />
        <!-- 내역 추가 버튼 -->
        <button
          type="button"
          @click="
            showAddModal = true;
            showDetailModal = false;
          "
          class="addButton"
        >
          내역 추가
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 기본 Vue API
import { ref, onMounted, computed, reactive, defineProps, watch } from 'vue';

import AddModal from './AddModal.vue';

// 자식 컴포넌트 (실제 UI는 숨겨놓고 데이터만 로드)
import Income from './Income.vue';
import Expense from './Expense.vue';

// 로그인한 사용자 정보 Store
import { useUserStore } from '../stores/user';
import DetailModal from './DetailModal.vue';
import axios from 'axios';
// Removed unused import: import Hiya from './Hiya.vue';

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
const targetDateYYYYMMDD = computed(() =>
  convertToYYYYMMDD(props.selectedDate)
);

// 자식 컴포넌트에서 emit된 수입 데이터를 저장
const handleIncomeLoaded = (incomeData) => {
  // Store the raw list received (which should already be for the selected day from the store)
  // parentIncomeList.value = incomeData || [];
  parentIncomeList.value = (incomeData || []).map((item) => ({
    ...item,
    type: 'income',
  }));
};

// 자식 컴포넌트에서 emit된 지출 데이터를 저장
const handleExpenseLoaded = (expenseData) => {
  // Store the raw list received
  // parentExpenseList.value = expenseData || [];
  parentExpenseList.value = (expenseData || []).map((item) => ({
    ...item,
    type: 'expense',
  }));
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
  const targetDate = targetDateYYYYMMDD.value; // Get "YYYY-MM-DD" format
  if (!userStore.user?.id || !targetDate) {
    return []; // Return empty if no user or no valid target date
  }
  // Filter the list stored locally by user_id AND the specific date
  return parentExpenseList.value.filter(
    (item) => item.user_id === userStore.user.id && item.date === targetDate
  );
});

// 화면에 표시용으로 날짜 포맷 변환 ("YYYY년 M월 D일")
const formattedSelectedDateForDisplay = computed(() => {
  if (!props.selectedDate) return '날짜를 선택해주세요'; // Default message

  // Use the conversion function, but format differently for display
  const yyyyMMdd = convertToYYYYMMDD(props.selectedDate);
  if (!yyyyMMdd) return props.selectedDate; // Fallback if conversion fails

  const [year, month, day] = yyyyMMdd.split('-');
  // Format to "YYYY년 MM월 DD일"
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
});

// 카테고리별 아이콘 반환 (향후 확장 가능)
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

const expenses = ref([]);
const incomes = ref([]);
const incomeCategories = ref([]);
const expenseCategories = ref([]);

const fetchData = async () => {
  const [expenseRes, incomeRes] = await Promise.all([
    axios.get('/api/expenses'),
    axios.get('/api/incomes'),
  ]);
  expenses.value = expenseRes.data.map((e) => ({ ...e, type: 'expense' }));
  incomes.value = incomeRes.data.map((i) => ({ ...i, type: 'income' }));
  // filterData();
};

const fetchCategories = async () => {
  try {
    const resIncome = await axios.get('/api/incomeCategory');
    const resExpense = await axios.get('/api/expenseCategory');

    incomeCategories.value = resIncome.data;
    expenseCategories.value = resExpense.data;
  } catch (e) {
    console.error('카테고리 로딩 실패', e);
  }
};

const showDetailModal = ref(false);
const isEditing = ref(false);
const selectedItem = ref(null);
const detailForm = reactive({
  id: '',
  type: '',
  amount: '',
  category: '',
  payment_method: '',
  description: '',
  date: '',
});

const openDetailModal = (item) => {
  selectedItem.value = item;
  Object.assign(detailForm, { ...item });
  isEditing.value = false;
  showDetailModal.value = true;
};

const closeModal = () => {
  showDetailModal.value = false;
  isEditing.value = false;
};

const saveEdit = async (editedItem) => {
  const originalType = selectedItem.value.type;
  const editedType = editedItem.type;
  const originalId = selectedItem.value.id;

  const newItem = {
    user_id: userStore.user?.id,
    amount: editedItem.amount,
    category: editedItem.category,
    description: editedItem.description,
    date: editedItem.date,
  };
  // type이 'expense'일 경우, payment_method를 추가
  if (editedType === 'expense') {
    newItem.payment_method = editedItem.payment_method;
  }

  try {
    if (originalType === editedType) {
      // 같은 테이블에서 수정
      newItem.id = originalId;
      await axios.put(`/api/${editedType}s/${originalId}`, newItem);
    } else {
      // 테이블이 다르면 삭제 후 새로 생성
      await axios.delete(`/api/${originalType}s/${originalId}`);

      const res = await axios.post(`/api/${editedType}s`, newItem);

      if (editedType === 'income') {
        incomes.value.push({ ...res.data, type: 'income' });
      } else {
        expenses.value.push({ ...res.data, type: 'expense' });
      }
    }

    await fetchData(); // 항목 갱신

    closeModal(); // 모달 닫기
  } catch (error) {
    console.error('수정 중 오류 발생:', error);
  }
};
// 항목 삭제
const deleteItem = async () => {
  try {
    const url = `/api/${detailForm.type}s/${detailForm.id}`;
    await axios.delete(url);

    const targetList =
      detailForm.type === 'income' ? incomes.value : expenses.value;
    const index = targetList.findIndex((i) => i.id === detailForm.id);
    if (index !== -1) targetList.splice(index, 1);

    closeModal();
    filterAndCombineData();
  } catch (err) {
    console.error('삭제 오류', err);
  }
};
// 항목 추가 모달
const showAddModal = ref(false);

const handleItemSubmitted = (item) => {
  if (item.type === 'income') {
    incomes.value.push(item);
  } else {
    expenses.value.push(item);
  }
  // filterAndCombineData();
};

onMounted(async () => {
  userStore.restoreUser();
  await userStore.fetchUser();
  await fetchData();
  await fetchCategories();
});
</script>

<style scoped>
/* 최상위 레이아웃 wrapper */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 40px 40px;
  /* min-height: 100vh; */
  max-height: 85vh;
  width: 90%;
}

/* 콘텐츠 박스 */
.main {
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  text-align: center;

  height: 600px;
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

.modal2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.modal2-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.modal2-content {
  position: relative;
  z-index: 2;
  background: white;
  width: 90%;
  max-width: 350px;
  max-height: 500px;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  width: 90%;
  max-width: 350px;
  max-height: 500px;

  overflow-y: auto;
}

/* ---------------------------------------------------------------- form */
.form-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 2rem;
  font-size: 14px;
}

.form-date {
  width: 100%;
  text-align: center;
  font-size: 18px;
  padding: 10px;
  border-bottom: 1px solid black;
}

.form-title {
  width: 35%;
  text-align: center;
  padding: 5px;
  border-left: 5px solid rgb(255, 204, 0);
  margin-left: 10px;
}

.form-data {
  width: 65%;
  padding: 5px;
  border-bottom: 1px solid black;
  margin-right: 10px;
  word-break: keep-all;
}

.form-body {
  flex: 1;
  overflow-y: auto;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.form-actions .left {
  display: flex;
  gap: 1rem;
}

.form-actions .right {
  display: flex;
  gap: 1rem;
}

.form-actions .left button:first-child {
  background-color: rgb(255, 204, 0);
  color: white;
}

.form-actions .left button:last-child {
  background-color: rgb(96, 88, 76);
  color: white;
}

.form-actions .right button:first-child {
  background-color: rgb(255, 188, 0);
  color: white;
}

.form-actions .right button:last-child {
  background-color: rgb(96, 88, 76);
  color: white;
}

/* button */

.addButton {
  width: 100px;
  height: 40px;
  cursor: pointer;
  background-color: rgb(255, 204, 0);
  color: white;
  font-weight: bold;
  margin-left: 10px;
}
</style>
