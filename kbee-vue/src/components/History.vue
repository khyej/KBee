<template>
    <div class="subBox">
        <div class="dropdown-container">
            <!-- Year Dropdown -->
            <div
                class="dropdown"
                @click="toggleDropdown('year')"
                :class="{ open: isOpen.year }"
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
        <!-- 통합 테이블 -->
        <div v-if="combinedData.length" class="results">
            <h3>
                📊 수입/지출 내역 ({{ selected.year }}년 {{ selected.month }})
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>유형</th>
                        <th>카테고리</th>
                        <th>내용</th>
                        <th>금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in combinedData" :key="item.id">
                        <td>{{ item.date }}</td>
                        <td>
                            {{ item.type === 'income' ? '수입' : '지출' }}
                        </td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.description }}</td>
                        <td :class="item.type">
                            {{ item.amount.toLocaleString() }}원
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const currentDate = new Date();

const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() - 2 + i
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
    filterAndCombineData();
};

const combinedData = ref([]);

const filterAndCombineData = () => {
    const all = [...expenses.value, ...incomes.value];
    const monthIndex = months.indexOf(selected.value.month);

    combinedData.value = all
        .filter((item) => {
            const date = new Date(item.date);
            return (
                date.getFullYear() === selected.value.year &&
                date.getMonth() === monthIndex &&
                item.user_id === userStore.user?.id
            );
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

watch(() => [selected.value.month, selected.value.year], filterAndCombineData);
</script>

<style scoped>
.subBox {
    /* width: 100%; */
    height: calc(100vh - 60px);
    /* margin: 5px; */
    margin: 5px;
    /* background-color: black; */
}
.dropdown-container {
    display: flex;
    gap: 1rem;
    font-family: sans-serif;
    margin-bottom: 1.5rem;
    flex-wrap: wrap; /* 작은 화면에서 줄바꿈 허용 */
}
.dropdown {
    position: relative;
    width: 140px;
    cursor: pointer;
    z-index: 5; /* dropdown이 테이블보다 위로 오게 */
}

.dropdown-toggle {
    padding: 10px;
    border: 1px solid #333;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 3;
}
.dropdown-toggle::after {
    content: '▾';
    margin-left: 8px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #333;
    border-top: none;
    background: #f9f9f9;
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
    z-index: 10; /* 테이블보다 확실히 위로 */
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown.open .dropdown-menu {
    display: block;
}

.dropdown-menu li {
    padding: 10px;
}

.dropdown-menu li:hover {
    background-color: #ddd;
}

.results {
    font-family: sans-serif;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px 12px;
    text-align: left;
}

th {
    background-color: #f0f0f0;
}

.expense {
    color: red;
}

.income {
    color: green;
}
</style>
