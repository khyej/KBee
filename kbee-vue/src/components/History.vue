<template>
  <div class="subBox" :class="{ 'has-subDiv-2': showDetailModal }">
    <div class="subDiv-1">
      <!-- 날짜 드롭다운 -->
      <div class="subDiv-header">
        <div class="left">
          <div class="dropdown-container">
            <div
              class="dropdown"
              @click="toggleDropdown('year')"
              :class="['dropdown', isOpen.year ? 'open' : '']"
            >
              <div class="dropdown-toggle">
                {{ dropDate.year }}
              </div>
              <ul class="dropdown-menu">
                <li
                  v-for="year in years"
                  :key="year"
                  @click.stop="selectOption('year', year)"
                >
                  {{ year }}
                </li>
              </ul>
            </div>
            <div
              class="dropdown"
              @click="toggleDropdown('month')"
              :class="{ open: isOpen.month }"
            >
              <div class="dropdown-toggle">
                {{ dropDate.month }}
              </div>
              <ul class="dropdown-menu">
                <li
                  v-for="month in months"
                  :key="month"
                  @click.stop="selectOption('month', month)"
                >
                  {{ month }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="dropdown-container">
            <div
              class="dropdown"
              @click="toggleFilterDropdown('type')"
              :class="{ open: isFilterDropdownOpen.type }"
            >
              <div class="dropdown-toggle">
                {{ filterDropdownLabels[selectedFilters.type] || '전체' }}
              </div>
              <ul class="dropdown-menu">
                <li @click.stop="selectFilterOption('type', 'all')">전체</li>
                <li @click.stop="selectFilterOption('type', 'income')">수입</li>
                <li @click.stop="selectFilterOption('type', 'expense')">
                  지출
                </li>
              </ul>
            </div>

            <!-- 카테고리 필터 -->
            <div
              class="dropdown"
              @click="toggleFilterDropdown('category')"
              :class="{ open: isFilterDropdownOpen.category }"
            >
              <div class="dropdown-toggle">
                {{
                  selectedFilters.category === 'all'
                    ? '카테고리'
                    : selectedFilters.category
                }}
              </div>
              <ul class="dropdown-menu">
                <li @click.stop="selectFilterOption('category', 'all')">
                  카테고리
                </li>
                <li
                  v-for="cat in categoryOptions"
                  :key="cat"
                  @click.stop="selectFilterOption('category', cat)"
                >
                  {{ cat }}
                </li>
              </ul>
            </div>
          </div>
          <!-- 키워드 검색 입력 -->
          <input
            type="text"
            :value="selectedFilters.keyword"
            @compositionstart="isComposing = true"
            @compositionend="onCompositionEnd"
            @input="onInput"
            placeholder="내용 검색"
          />

          <!-- 내역 추가 버튼 -->
          <button
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
      <!-- 테이블 영역 -->
      <div class="subDiv-body results">
        <div class="table-wrap">
          <table>
            <colgroup>
              <col style="width: 10%" />
              <col style="width: 15%" />
              <col style="width: 40%" />
              <col style="width: 20%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>날짜</th>
                <th>내용</th>
                <th>금액</th>
                <th>카테고리</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="combinedData.length">
                <tr
                  v-for="item in combinedData"
                  :key="item.id"
                  @click="openDetailModal(item)"
                  style="cursor: pointer"
                >
                  <td>
                    {{ item.type === 'income' ? '수입' : '지출' }}
                  </td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.description }}</td>
                  <td :class="item.type">
                    {{ item.amount.toLocaleString() }}원
                  </td>

                  <td>
                    <font-awesome-icon :icon="getIcon(item.category)" />
                    {{ item.category }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5">내역이 없습니다</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="subDiv-2" v-if="showDetailModal">
      <!-- 상세 보기 -->
      <DetailModal
        class="body"
        :visible="showDetailModal"
        :selected-item="selectedItem"
        :income-categories="incomeCategories"
        :expense-categories="expenseCategories"
        customClass="history"
        @close="closeModal"
        @delete="deleteItem"
        @save="saveEdit"
      />
    </div>
    <!-- 항목 추가 모달 -->
    <div class="modal" v-if="showAddModal">
      <div class="modal-overlay" @click="showAddModal = false"></div>
      <div class="modal-content">
        <div class="form-body">
          <div class="form-row">
            <div class="form-date">항목 추가</div>
          </div>
          <div class="form-row">
            <div class="form-title">날짜</div>
            <input type="date" v-model="form.date" class="form-data" />
          </div>
          <div class="form-row">
            <div class="form-title">유형</div>
            <select v-model="mode" class="form-data">
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-title">카테고리</div>
            <select v-model="form.category" class="form-data">
              <option disabled value="">카테고리 선택</option>
              <option
                v-for="cat in mode === 'income'
                  ? incomeCategories
                  : expenseCategories"
                :key="cat.id"
                :value="cat.name"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-title">내용</div>
            <input type="text" v-model="form.description" class="form-data" />
          </div>
          <div class="form-row" v-if="mode === 'expense'">
            <div class="form-title">결제 수단</div>
            <input
              type="text"
              v-model="form.payment_method"
              class="form-data"
            />
          </div>
          <div class="form-row">
            <div class="form-title">금액</div>
            <input type="number" v-model="form.amount" class="form-data" />
          </div>
        </div>
        <div class="form-actions">
          <div class="left"></div>
          <div class="right">
            <button @click="handleSubmit">저장</button>
            <button @click="showAddModal = false">취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DetailModal from './DetailModal.vue';
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  reactive,
} from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const currentDate = new Date();

const years = Array.from(
  { length: 5 },
  (_, i) => currentDate.getFullYear() - 4 + i
);

const months = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

const dropDate = ref({
  month: months[currentDate.getMonth()],
  year: currentDate.getFullYear(),
});

const isOpen = ref({ month: false, year: false });
const isFilterDropdownOpen = ref({ type: false, category: false });
const filterDropdownLabels = {
  all: '전체',
  income: '수입',
  expense: '지출',
};

const toggleDropdown = (type) => {
  isOpen.value[type] = !isOpen.value[type];
  Object.keys(isOpen.value).forEach((key) => {
    if (key !== type) isOpen.value[key] = false;
  });
};

const selectOption = (type, value) => {
  dropDate.value[type] = value;
  isOpen.value[type] = false;
  filterAndCombineData();
};

const closeAll = () => {
  isOpen.value.month = false;
  isOpen.value.year = false;
};

const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown')) closeAll();
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
  extractCategories();
  filterAndCombineData();
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

const combinedData = ref([]);
const selectedFilters = ref({
  type: 'all',
  category: 'all',
  keyword: '',
});

const categoryOptions = computed(() => {
  if (selectedFilters.value.type === 'income') {
    return incomeCategories.value.map((c) => c.name);
  } else if (selectedFilters.value.type === 'expense') {
    return expenseCategories.value.map((c) => c.name);
  } else {
    const set = new Set([
      ...incomeCategories.value.map((c) => c.name),
      ...expenseCategories.value.map((c) => c.name),
    ]);
    return Array.from(set).sort();
  }
});

const extractCategories = () => {
  // 기존 카테고리 전체 추출은 categoryOptions에서 대체됨
};

const filterAndCombineData = () => {
  if (!userStore.user) return;
  const all = [...expenses.value, ...incomes.value];
  combinedData.value = all
    .filter((item) => {
      const matchesDate = item.date?.startsWith(
        `${dropDate.value.year}-${dropDate.value.month}`
      );
      const matchesUser = item.user_id === userStore.user?.id;
      const matchesType =
        selectedFilters.value.type === 'all' ||
        item.type === selectedFilters.value.type;
      const matchesCategory =
        selectedFilters.value.category === 'all' ||
        item.category === selectedFilters.value.category;
      const matchesKeyword = item.description
        .toLowerCase()
        .includes(selectedFilters.value.keyword.toLowerCase());

      return (
        matchesDate &&
        matchesUser &&
        matchesType &&
        matchesCategory &&
        matchesKeyword
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const isComposing = ref(false);
const onInput = (e) => {
  selectedFilters.value.keyword = e.target.value;
  if (!isComposing.value) filterAndCombineData();
};
const onCompositionEnd = (e) => {
  isComposing.value = false;
  selectedFilters.value.keyword = e.target.value;
  filterAndCombineData();
};

const showAddModal = ref(false);
const mode = ref('income');
const form = reactive({
  amount: '',
  category: '',
  payment_method: '',
  description: '',
  date: '',
});

const getNextId = (list) => {
  const ids = list.map((item) => Number(item.id));
  const max = ids.length ? Math.max(...ids) : 0;
  return String(max + 1);
};

const handleSubmit = async () => {
  const newItem = {
    id: getNextId([...incomes.value, ...expenses.value]),
    user_id: userStore.user?.id,
    amount: Number(form.amount),
    category: form.category,
    description: form.description,
    date: form.date,
  };
  if (mode.value === 'expense') newItem.payment_method = form.payment_method;
  const url = `/api/${mode.value}s`;

  try {
    await axios.post(url, newItem);
    if (mode.value === 'income') {
      incomes.value.push({ ...newItem, type: 'income' });
    } else {
      expenses.value.push({ ...newItem, type: 'expense' });
    }

    Object.assign(form, {
      amount: '',
      category: '',
      payment_method: '',
      description: '',
      date: '',
    });
    showAddModal.value = false;
    filterAndCombineData();
  } catch (e) {
    console.error('저장 실패', e);
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

const saveEdit = async () => {
  try {
    const url = `/api/${detailForm.type}s/${detailForm.id}`;
    await axios.put(url, { ...detailForm });
    const targetList =
      detailForm.type === 'income' ? incomes.value : expenses.value;
    const index = targetList.findIndex((i) => i.id === detailForm.id);
    if (index !== -1) targetList[index] = { ...detailForm };
    closeModal();
    filterAndCombineData();
  } catch (err) {
    console.error('수정 오류', err);
  }
};

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

const toggleFilterDropdown = (key) => {
  isFilterDropdownOpen.value[key] = !isFilterDropdownOpen.value[key];
  Object.keys(isFilterDropdownOpen.value).forEach((k) => {
    if (k !== key) isFilterDropdownOpen.value[k] = false;
  });
};

const selectFilterOption = (key, value) => {
  selectedFilters.value[key] = value;
  isFilterDropdownOpen.value[key] = false;
  filterAndCombineData();
};

const handleClickOutsideFilters = (e) => {
  if (!e.target.closest('.dropdown')) {
    isFilterDropdownOpen.value.type = false;
    isFilterDropdownOpen.value.category = false;
  }
};
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

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', handleClickOutsideFilters);
  userStore.restoreUser();
  await userStore.fetchUser();
  await fetchData();
  await fetchCategories();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', handleClickOutsideFilters);
});

watch(
  [() => dropDate.value.month, () => dropDate.value.year],
  filterAndCombineData
);
watch(() => selectedFilters.value.keyword, filterAndCombineData);
watch(
  () => [selectedFilters.value.type, selectedFilters.value.category],
  filterAndCombineData
);
</script>

<style scoped>
/* subBox */
.subBox {
  width: 100%;
  min-width: 400px;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.subDiv-1 {
  flex-grow: 1;
  height: 100%;
  min-width: 560px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.subDiv-2 {
  flex: 1;
  align-items: center;
  margin-left: 20px;
  display: flex; /* ✅ 필수 */
  flex-direction: column;
  flex-grow: 1;
  align-items: stretch;
}

.subDiv-2 .body {
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.subBox.has-subDiv-2 .subDiv-1 {
  width: 70%;
  flex-grow: 0;
}

.subDiv-header {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-radius: 12px;
  height: 80px;
  margin-bottom: 20px;
  padding: 20px;
}

.subDiv-header .right {
  display: flex;
}

.subDiv-header .right input {
  border-top: 1px solid rgb(255, 188, 0);
  border-right: 1px solid rgb(255, 188, 0);
  border-bottom: 1px solid rgb(255, 188, 0);
  width: 200px;
  padding: 0 10px;
}

.subDiv-body {
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

/* --------------------------------------------------- dropdown */
.dropdown-container {
  display: flex;
  border: 1px solid rgb(255, 188, 0);
  width: fit-content;
  margin-bottom: 2rem;
  /* flex-wrap: wrap; */
  height: 40px;
}

.dropdown-container input:focus {
  outline: none;
  border: 4px solid rgb(255, 188, 0);
}

.dropdown {
  position: relative;
  width: 100px;
  cursor: pointer;
  z-index: 5;
  text-align: center;
  margin: 0;
  box-sizing: border-box;
}

.dropdown + .dropdown {
  border-left: 1px solid rgb(255, 188, 0);
}

.dropdown-toggle {
  padding: 8px 12px;
  font-size: 16px;
  position: relative;
}

.dropdown-toggle::after {
  content: '▾';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: rgb(84, 80, 69);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: white;
  border-top: none;
  z-index: 20;
  list-style: none;
  padding: 0;
  margin: 0;
  display: none;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 7px 9px rgba(84, 80, 69, 0.1);
}

.dropdown-menu li:first-child {
  border-top: 1px solid rgb(255, 188, 0);
}

.dropdown-menu::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

.dropdown.open .dropdown-menu {
  display: block;
}

.dropdown-menu li {
  padding: 8px 12px;
  font-size: 14px;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

/* ---------------------------------------------------------- table */

.results {
  flex-grow: 1;
  flex-shrink: 1;
  transition: all 0.4s ease;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.table-wrap {
  /* flex: 1; */
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  height: calc(100vh - 230px);
}

.table-wrap::-webkit-scrollbar {
  display: none;
}

th,
td {
  padding: 8px 12px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  font-size: 13px;
}

tr td:last-child,
tr th:last-child {
  border-right: none;
}

th {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;
  padding: 8px 12px;
}

td:nth-child(1),
td:nth-child(2) {
  text-align: center;
}

.expense {
  color: red;
}

.income {
  color: green;
}

/* ------------------------------------------------------------- addModal */
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
  /* ✅ 이 영역이 위쪽 공간을 모두 차지하게 */
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

@media (max-width: 1110px) {
  .subBox {
    /* flex-direction: column; */
    /* height: 100%; */
  }

  .subDiv-header {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    gap: 10px;
  }

  .subDiv-2 .body {
    /* width: 380px; */
    background-color: rgba(0, 0, 0, 0.2);
  }
  .dropdown-container {
    margin: 0;
  }

  .dropdown-toggle {
    height: 100%;
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
}

@media (max-width: 1350px) {
  .dropdown-container {
    margin: 0;
  }

  .dropdown-toggle {
    height: 100%;
  }
  .subBox.has-subDiv-2 .subDiv-1 .subDiv-header {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    gap: 10px;
  }
}
</style>
