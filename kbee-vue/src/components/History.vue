<template>
    <div class="subBox">
        <div class="subDiv">
            <div class="dropdown-container">
                <!-- Year Dropdown -->
                <div
                    class="dropdown"
                    @click="toggleDropdown('year')"
                    :class="['dropdown', isOpen.year ? 'open' : '']"
                >
                    <div class="dropdown-toggle">{{ selected.year }}</div>
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
                <!-- Month Dropdown -->
                <div
                    class="dropdown"
                    @click="toggleDropdown('month')"
                    :class="{ open: isOpen.month }"
                >
                    <div class="dropdown-toggle">{{ selected.month }}</div>
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
            <!--  필터 영역 -->
            <div class="filters">
                <!-- 수입/지출 필터 -->
                <select v-model="selectedFilters.type">
                    <option value="all">전체</option>
                    <option value="income">수입</option>
                    <option value="expense">지출</option>
                </select>

                <!-- 카테고리 필터 -->
                <select v-model="selectedFilters.category">
                    <option value="all">전체 카테고리</option>
                    <option
                        v-for="cat in categoryOptions"
                        :key="cat"
                        :value="cat"
                    >
                        {{ cat }}
                    </option>
                </select>

                <!-- 내용 필터 -->
                <input
                    type="text"
                    :value="selectedFilters.keyword"
                    @compositionstart="isComposing = true"
                    @compositionend="onCompositionEnd"
                    @input="onInput"
                    placeholder="내용 검색"
                />
            </div>
            <!-- 추가 버튼 -->
            <button @click="showAddModal = true" class="addButton">
                내역 추가
            </button>
        </div>

        <div class="subDiv">
            <!-- 통합 테이블 -->
            <div class="results">
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
                                        {{
                                            item.type === 'income'
                                                ? '수입'
                                                : '지출'
                                        }}
                                    </td>
                                    <td>{{ item.date }}</td>

                                    <td>{{ item.description }}</td>
                                    <td :class="item.type">
                                        {{ item.amount.toLocaleString() }}원
                                    </td>
                                    <td>{{ item.category }}</td>
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

            <!-- 상세 보기 -->
            <div class="modal2" v-if="showDetailModal">
                <div class="modal2-overlay" @click="closeModal"></div>
                <div class="modal2-content">
                    <template v-if="!isEditing">
                        <div class="form-row">
                            <div class="form-date">{{ selectedItem.date }}</div>
                        </div>

                        <div class="form-row">
                            <div class="form-title">분류</div>
                            <div class="form-data">
                                {{
                                    selectedItem.type === 'expense'
                                        ? '지출'
                                        : '수입'
                                }}
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-title">카테고리</div>
                            <div class="form-data">
                                {{ selectedItem.category }}
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-title">내용</div>
                            <div class="form-data">
                                {{ selectedItem.description }}
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-title">금액</div>
                            <div class="form-data">
                                {{ selectedItem.amount }}
                            </div>
                        </div>

                        <div class="form-actions">
                            <button @click="isEditing = true">수정</button>
                            <button @click="deleteItem">삭제</button>
                            <button @click="closeModal">닫기</button>
                        </div>
                    </template>

                    <template v-else>
                        <div class="form-row">
                            <div class="form-date">수정</div>
                        </div>

                        <div class="form-row">
                            <div class="form-title">날짜</div>
                            <input
                                v-model="detailForm.date"
                                type="date"
                                class="form-data"
                            />
                        </div>

                        <div class="form-row">
                            <div class="form-title">분류</div>
                            <select v-model="detailForm.type" class="form-data">
                                <option value="income">수입</option>
                                <option value="expense">지출</option>
                            </select>
                        </div>

                        <div class="form-row">
                            <div class="form-title">카테고리</div>
                            <input
                                v-model="detailForm.category"
                                type="text"
                                class="form-data"
                            />
                        </div>

                        <div class="form-row">
                            <div class="form-title">내용</div>
                            <input
                                v-model="detailForm.description"
                                type="text"
                                class="form-data"
                            />
                        </div>

                        <div class="form-row">
                            <div class="form-title">금액</div>
                            <input
                                v-model.number="detailForm.amount"
                                type="number"
                                class="form-data"
                            />
                        </div>

                        <div class="form-actions">
                            <button @click="saveEdit">저장</button>
                            <button @click="isEditing = false">취소</button>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- 항목 추가 모달 -->
        <div class="modal" v-if="showAddModal">
            <div class="modal-overlay" @click="showAddModal = false"></div>
            <div class="modal-content">
                <h2>항목 추가</h2>

                <div class="form-row">
                    <label>유형</label>
                    <select v-model="mode">
                        <option value="income">수입</option>
                        <option value="expense">지출</option>
                    </select>
                </div>

                <div class="form-row">
                    <label>금액</label>
                    <input type="number" v-model="form.amount" />
                </div>

                <div class="form-row">
                    <label>카테고리</label>
                    <input type="text" v-model="form.category" />
                </div>

                <div class="form-row">
                    <label>내용</label>
                    <input type="text" v-model="form.description" />
                </div>

                <div class="form-row" v-if="mode === 'expense'">
                    <label>결제 수단</label>
                    <input type="text" v-model="form.payment_method" />
                </div>

                <div class="form-row">
                    <label>날짜</label>
                    <input type="date" v-model="form.date" />
                </div>

                <div class="form-actions">
                    <button @click="handleSubmit">저장</button>
                    <button @click="showAddModal = false">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
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

const currentDate = new Date();

const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 4 + i
);

const selected = ref({
    month: months[currentDate.getMonth()],
    year: currentDate.getFullYear(),
});

const isOpen = ref({
    month: false,
    year: false,
});

const toggleDropdown = (type) => {
    isOpen.value[type] = !isOpen.value[type];
    Object.keys(isOpen.value).forEach((key) => {
        if (key !== type) isOpen.value[key] = false;
    });
};

const selectOption = (type, value) => {
    selected.value[type] = value;
    isOpen.value[type] = false;
    filterAndCombineData();
};

const closeAll = () => {
    isOpen.value.month = false;
    isOpen.value.year = false;
};

const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown')) {
        closeAll();
    }
};

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    userStore.restoreUser();
    await userStore.fetchUser();
    await fetchData();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const expenses = ref([]);
const incomes = ref([]);

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

const combinedData = ref([]);

const selectedFilters = ref({
    type: 'all',
    category: 'all',
    keyword: '',
});

const categoryOptions = ref([]);

const extractCategories = () => {
    if (!userStore.user) return;

    const all = [...expenses.value, ...incomes.value];
    const categories = new Set();
    all.forEach((item) => {
        if (item.user_id === userStore.user?.id) {
            categories.add(item.category);
        }
    });
    categoryOptions.value = Array.from(categories).sort();
};

const filterAndCombineData = () => {
    if (!userStore.user) {
        console.warn('사용자 정보가 아직 로드되지 않았습니다.');
        return;
    }

    const all = [...expenses.value, ...incomes.value];
    const monthIndex = months.indexOf(selected.value.month);
    combinedData.value = all
        .filter((item) => {
            const date = new Date(item.date);
            const matchesDate = item.date?.startsWith(
                `${selected.value.year}-${selected.value.month}`
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
    const value = e.target.value;
    selectedFilters.value.keyword = value;

    // 조합 중이 아니면 바로 필터링
    if (!isComposing.value) {
        filterAndCombineData();
    }
};

const onCompositionEnd = (e) => {
    isComposing.value = false;
    selectedFilters.value.keyword = e.target.value;
    filterAndCombineData();
};

// 항목 추가하기
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

    if (mode.value === 'expense') {
        newItem.payment_method = form.payment_method;
    }

    const url = `/api/${mode.value}s`;

    try {
        // 실제 DB에 저장
        await axios.post(url, newItem);

        // 화면에만 반영
        if (mode.value === 'income') {
            incomes.value.push({ ...newItem, type: 'income' });
        } else {
            expenses.value.push({ ...newItem, type: 'expense' });
        }

        // 폼 초기화
        Object.assign(form, {
            amount: '',
            category: '',
            payment_method: '',
            description: '',
            date: '',
        });

        showAddModal.value = false;

        // 화면 갱신
        extractCategories(); // 새로운 카테고리일 수 있으므로
        filterAndCombineData();
    } catch (error) {
        console.error('저장 실패:', error);
    }
};

// 항목 상세보기
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

// 수정 저장
const saveEdit = async () => {
    try {
        const url = `/api/${detailForm.type}s/${detailForm.id}`;
        await axios.put(url, { ...detailForm });

        const targetList =
            detailForm.type === 'income' ? incomes.value : expenses.value;

        const index = targetList.findIndex((i) => i.id === detailForm.id);
        if (index !== -1) {
            targetList[index] = { ...detailForm };
        }

        isEditing.value = false;
        closeModal();
        filterAndCombineData();
    } catch (err) {
        console.error('수정 오류', err);
    }
};

// 삭제
const deleteItem = async () => {
    try {
        const url = `/api/${detailForm.type}s/${detailForm.id}`;
        await axios.delete(url);

        const targetList =
            detailForm.type === 'income' ? incomes.value : expenses.value;
        const index = targetList.findIndex((i) => i.id === detailForm.id);
        if (index !== -1) {
            targetList.splice(index, 1);
        }

        closeModal();
        filterAndCombineData();
    } catch (err) {
        console.error('삭제 오류', err);
    }
};

// watch
watch(
    [() => selected.value.month, () => selected.value.year],
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
    height: calc(100vh - 90px);
    padding: 30px;
    background-color: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.subDiv {
    display: flex;
    width: 100%;
    transition: all 0.4s ease;
}
/* dropdown */
.dropdown-container {
    display: flex;
    /* gap: 1rem; */
    border: 1px solid #ccc;
    width: fit-content;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.dropdown {
    position: relative;
    width: 140px;
    cursor: pointer;
    z-index: 5;
    text-align: center;
    margin: 0;
    box-sizing: border-box;
}

.dropdown + .dropdown {
    border-left: 1px solid #ccc;
}

.dropdown-toggle {
    padding: 8px 12px;
    background-color: yellow;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    box-sizing: border-box;
}

.dropdown-toggle::after {
    content: '▾';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background: white;
    border-top: none;
    z-index: 10;
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
    max-height: 220px;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
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

/* table */

.results {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 100%;
    transition: all 0.4s ease;
}

table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
}

.table-wrap {
    flex: 1; /* 남은 공간 모두 사용 */
    overflow-y: auto;
    overflow-x: auto;
    height: calc(100vh - 234px);
    margin-bottom: 50px;
    margin-right: 70px;
    /* border: 1px solid #ccc; */
}

.table-wrap::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

th,
td {
    /* border: 1px solid #ccc; */
    padding: 8px 12px;
    /* text-align: left; */
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
    /* background-color: #f0f0f0; */
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

/* filter */
.filters {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.filters select,
.filters input {
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* addModal */
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
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h2,
.modal-content h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
}

/* --------------------------------------------------------- */
.modal2 {
    width: 400px;
    background: white;
    height: calc(100vh - 234px);
    transition: all 0.4s ease;
    max-height: calc(100vh - 90px); /* 헤더 제외 */
}
.modal2-content {
    position: relative;
    background: white;
    height: 100%;
    padding: 1rem;
    margin: 0 3px;
    /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */
    border: 1px solid black;
}

.modal2-content h2,
.modal2-content h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
}

/* ----------------------------------------------------------- */
.form-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
    font-size: 14px;
}

.form-row input,
.form-row select {
    width: 65%;
    padding: 5px;
    border-bottom: 1px solid black;
    margin-right: 10px;
    word-break: keep-all;
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
    border-left: 5px solid rgb(240, 240, 75);
    margin-left: 10px;
}

.form-data {
    width: 65%;
    padding: 5px;
    border-bottom: 1px solid black;
    margin-right: 10px;
    word-break: keep-all;
}

.form-actions {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.form-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
}

.form-actions button:first-child {
    background-color: #4caf50;
    color: white;
}

.form-actions button:nth-child(2) {
    background-color: #ccc;
    color: black;
}

.form-actions button:nth-child(3) {
    background-color: #f44336;
    color: white;
}

/* 추가, 수정 모달 버튼 */
/* .form-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.form-actions button:first-child {
    background-color: #4caf50;
    color: white;
}

.form-actions button:nth-child(2) {
    background-color: #ccc;
    color: black;
} */

/* button */
.addButton {
    width: 100px;
    height: 30px;
    cursor: pointer;
    background-color: #4caf50; /* 원의 배경 색상 */
    color: white;
}
</style>
