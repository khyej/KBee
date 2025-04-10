<template>
    <!-- 메인 박스: 상세 모달이 열리면 클래스가 추가됨 -->
    <div class="subBox" :class="{ 'has-subDiv-2': showDetailModal }">
        <!-- 좌측 내역 영역 -->
        <div class="subDiv-1">
            <!-- 상단 필터 & 검색 영역 -->
            <div class="subDiv-header">
                <div class="left">
                    <!-- 연도 / 월 선택 드롭다운 -->
                    <div class="dropdown-container">
                        <!-- 연도 선택 -->
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
                        <!-- 월 선택 -->
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
                    <!-- 수입/지출 및 카테고리 필터 -->
                    <div class="dropdown-container">
                        <!-- 수입/지출 필터 -->
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
                                <li @click.stop="selectFilterOption('type', 'expense')">지출</li>
                            </ul>
                        </div>

                        <!-- 카테고리 필터 -->
                        <div
                            class="dropdown"
                            @click="toggleFilterDropdown('category')"
                            :class="{ open: isFilterDropdownOpen.category }"
                        >
                            <div class="dropdown-toggle">
                                <!-- 'all'이면 '카테고리' 표시 -->
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

                    <!-- 키워드 검색 -->
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

            <!-- 내역 테이블 -->
            <div class="subDiv-body results">
                <div class="table-wrap">
                    <table>
                        <!-- 열 너비 지정 -->
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
                            <!-- 내역이 있을 때 -->
                            <template v-if="combinedData.length">
                                <tr
                                    v-for="item in combinedData"
                                    :key="item.id"
                                    @click="openDetailModal(item)"
                                    style="cursor: pointer"
                                >
                                    <td>{{ item.type === 'income' ? '수입' : '지출' }}</td>
                                    <td>{{ item.date }}</td>
                                    <td>{{ item.description }}</td>
                                    <td :class="item.type">{{ item.amount.toLocaleString() }}원</td>
                                    <td>
                                        <font-awesome-icon :icon="getIcon(item.category)" />
                                        {{ item.category }}
                                    </td>
                                </tr>
                            </template>

                            <!-- 내역이 없을 때 -->
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

        <!-- 상세 보기 모달 -->
        <div class="subDiv-2" v-if="showDetailModal">
            <!-- <DetailModal
                class="body"
                :visible="showDetailModal"
                :selected-item="selectedItem"
                :income-categories="incomeCategories"
                :expense-categories="expenseCategories"
                customClass="history"
                @close="closeModal"
                @delete="deleteItem"
                @save="saveEdit"
            /> -->
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
        <AddModal
            :visible="showAddModal"
            :income-categories="incomeCategories"
            :expense-categories="expenseCategories"
            @close="showAddModal = false"
            @submitted="handleItemSubmitted"
        />
        <!-- <AddModal
            :visible="showAddModal"
            :incomes="incomes"
            :expenses="expenses"
            :income-categories="incomeCategories"
            :expense-categories="expenseCategories"
            @close="showAddModal = false"
            @submitted="handleItemSubmitted"
        /> -->
    </div>
</template>

<script setup>
// 상세 보기 모달 컴포넌트
import DetailModal from './DetailModal.vue';

import AddModal from './AddModal.vue';

// Vue 관련 함수 import
import { ref, onMounted, onBeforeUnmount, computed, watch, reactive } from 'vue';
// HTTP 요청용 axios
import axios from 'axios';
// 사용자 정보를 담고 있는 store
import { useUserStore } from '@/stores/user';

// 사용자 store 인스턴스 가져오기
const userStore = useUserStore();

// 현재 날짜 기준 연도/월 초기 설정
const currentDate = new Date();

// 최근 5년치 연도 목록 생성
const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 4 + i);

// 1~12월 목록
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

// 선택된 연/월을 저장
const dropDate = ref({
    month: months[currentDate.getMonth()],
    year: currentDate.getFullYear(),
});

// 드롭다운 열림 상태
const isOpen = ref({ month: false, year: false });
const isFilterDropdownOpen = ref({ type: false, category: false });

// 필터 드롭다운 라벨
const filterDropdownLabels = {
    all: '전체',
    income: '수입',
    expense: '지출',
};

// 연/월 드롭다운 토글
const toggleDropdown = (type) => {
    isOpen.value[type] = !isOpen.value[type];
    Object.keys(isOpen.value).forEach((key) => {
        if (key !== type) isOpen.value[key] = false;
    });
};

// 연/월 선택 시 상태 업데이트 및 필터 적용
const selectOption = (type, value) => {
    dropDate.value[type] = value;
    isOpen.value[type] = false;
    filterAndCombineData();
};

// 드롭다운 닫기
const closeAll = () => {
    isOpen.value.month = false;
    isOpen.value.year = false;
};

// 드롭다운 외부 클릭 감지
const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown')) closeAll();
};

// 수입/지출 데이터 및 카테고리 목록
const expenses = ref([]);
const incomes = ref([]);
const incomeCategories = ref([]);
const expenseCategories = ref([]);

// 데이터 로드 (수입/지출)
const fetchData = async () => {
    const [expenseRes, incomeRes] = await Promise.all([
        axios.get('/api/expenses'),
        axios.get('/api/incomes'),
    ]);
    expenses.value = expenseRes.data.map((e) => ({ ...e, type: 'expense' }));
    incomes.value = incomeRes.data.map((i) => ({ ...i, type: 'income' }));

    filterAndCombineData();
};

// 카테고리 데이터 로드
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

// 최종 필터링된 내역 리스트
const combinedData = ref([]);

// 선택된 필터 상태
const selectedFilters = ref({
    type: 'all', // all | income | expense
    category: 'all', // all | 실제 카테고리 이름
    keyword: '', // 검색어
});

// 필터에서 보여줄 카테고리 목록 (type에 따라)
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

// 필터 적용 및 리스트 업데이트
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
                selectedFilters.value.type === 'all' || item.type === selectedFilters.value.type;
            const matchesCategory =
                selectedFilters.value.category === 'all' ||
                item.category === selectedFilters.value.category;
            const matchesKeyword = item.description
                .toLowerCase()
                .includes(selectedFilters.value.keyword.toLowerCase());

            return matchesDate && matchesUser && matchesType && matchesCategory && matchesKeyword;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// 검색 입력 조합 중 여부 체크용
const isComposing = ref(false);

// 검색 입력 이벤트
const onInput = (e) => {
    selectedFilters.value.keyword = e.target.value;
    if (!isComposing.value) filterAndCombineData();
};

// 조합 완료 시
const onCompositionEnd = (e) => {
    isComposing.value = false;
    selectedFilters.value.keyword = e.target.value;
    filterAndCombineData();
};

// 항목 추가 모달
const showAddModal = ref(false);

const handleItemSubmitted = (item) => {
    if (item.type === 'income') {
        incomes.value.push(item);
    } else {
        expenses.value.push(item);
    }
    filterAndCombineData();
};

// 상세 보기 모달 관련
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

// 상세 모달 열기
const openDetailModal = (item) => {
    selectedItem.value = item;
    Object.assign(detailForm, { ...item });
    isEditing.value = false;
    showDetailModal.value = true;
};

// 상세 모달 닫기
const closeModal = () => {
    showDetailModal.value = false;
    isEditing.value = false;
};

// 항목 수정 저장

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
            newItem.id = originalId;
            // 같은 테이블에서 수정
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

        const targetList = detailForm.type === 'income' ? incomes.value : expenses.value;
        const index = targetList.findIndex((i) => i.id === detailForm.id);
        if (index !== -1) targetList.splice(index, 1);

        closeModal();
        filterAndCombineData();
    } catch (err) {
        console.error('삭제 오류', err);
    }
};

// 필터 드롭다운 토글
const toggleFilterDropdown = (key) => {
    isFilterDropdownOpen.value[key] = !isFilterDropdownOpen.value[key];
    Object.keys(isFilterDropdownOpen.value).forEach((k) => {
        if (k !== key) isFilterDropdownOpen.value[k] = false;
    });
};

// 필터 옵션 선택
const selectFilterOption = (key, value) => {
    selectedFilters.value[key] = value;
    isFilterDropdownOpen.value[key] = false;
    filterAndCombineData();
};

// 필터 드롭다운 외부 클릭 감지
const handleClickOutsideFilters = (e) => {
    if (!e.target.closest('.dropdown')) {
        isFilterDropdownOpen.value.type = false;
        isFilterDropdownOpen.value.category = false;
    }
};

// 카테고리에 따른 아이콘 반환
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

// 마운트 시 초기 데이터 로딩 + 이벤트 리스너 등록
onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutsideFilters);
    userStore.restoreUser();
    await userStore.fetchUser();
    await fetchData();
    await fetchCategories();
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('click', handleClickOutsideFilters);
});

// 필터 조건 변경 감지 → 내역 재필터링
watch([() => dropDate.value.month, () => dropDate.value.year], filterAndCombineData);
watch(() => selectedFilters.value.keyword, filterAndCombineData);
watch(() => [selectedFilters.value.type, selectedFilters.value.category], filterAndCombineData);
</script>

<style scoped>
/* ============================== */
/* ✅ 메인 구조: subBox와 영역 분할 */
/* ============================== */

.subBox {
    width: 100%;
    min-width: 400px;
    height: calc(100vh - 90px);
    /* 상단 영역 제외 전체 높이 */
    display: flex;
    flex-direction: row;
    /* 좌우 배치 */
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: stretch;
}

/* 상세보기 영역 내부 스타일 */
.subDiv-2 .body {
    background-color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* 상세보기 열렸을 때 좌측 영역 너비 축소 */
.subBox.has-subDiv-2 .subDiv-1 {
    width: 70%;
    flex-grow: 0;
}

/* ============================== */
/* ✅ 상단 필터 영역 */
/* ============================== */
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

/* ============================== */
/* ✅ 메인 테이블 영역 */
/* ============================== */
.subDiv-body {
    padding: 20px;
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
}

/* ============================== */
/* ✅ 드롭다운 공통 스타일 */
/* ============================== */
.dropdown-container {
    display: flex;
    border: 1px solid rgb(255, 188, 0);
    width: fit-content;
    margin-bottom: 2rem;
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
    background: white;
    display: none;
    max-height: 220px;
    overflow-y: auto;
    z-index: 20;
    box-shadow: 0 7px 9px rgba(84, 80, 69, 0.1);
    list-style: none;
    padding: 0;
    margin: 0;
}

.dropdown.open .dropdown-menu {
    display: block;
}

.dropdown-menu li {
    padding: 8px 12px;
    font-size: 14px;
}

.dropdown-menu li:first-child {
    border-top: 1px solid rgb(255, 188, 0);
}

.dropdown-menu li:hover {
    background-color: #f0f0f0;
}

.dropdown-menu::-webkit-scrollbar {
    display: none;
    /* 스크롤바 숨김 */
}

/* ============================== */
/* ✅ 테이블 스타일 */
/* ============================== */
.results {
    flex-grow: 1;
    flex-shrink: 1;
    transition: all 0.4s ease;
}

.table-wrap {
    width: 100%;
    overflow-y: auto;
    overflow-x: auto;
    height: calc(100vh - 230px);
}

.table-wrap::-webkit-scrollbar {
    display: none;
}

table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
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
}

td:nth-child(1),
td:nth-child(2) {
    text-align: center;
}

/* 수입/지출 색상 구분 */
.expense {
    color: red;
}

.income {
    color: green;
}

/* 추가 버튼 스타일 */
.addButton {
    width: 100px;
    height: 40px;
    cursor: pointer;
    background-color: rgb(255, 204, 0);
    color: white;
    font-weight: bold;
    margin-left: 10px;
}

/* ============================== */
/* ✅ 반응형 (모바일 대응) */
/* ============================== */
@media (max-width: 1110px) {
    .subDiv-header {
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        gap: 10px;
    }

    .subDiv-2 .body {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .dropdown-container {
        margin: 0;
    }

    .dropdown-toggle {
        height: 100%;
    }

    /* 추가 모달 반응형 */
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
        max-height: 600px;
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
