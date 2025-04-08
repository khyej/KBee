<template>
    <div>
        <History />
    </div>
    <!-- <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">📋 수입 / 지출 내역</h2>

        <div class="flex space-x-2 mb-6">
            <button type="button" @click="mode = 'all'" :class="btnClass('all')">전체</button>
            <button type="button" @click="mode = 'income'" :class="btnClass('income')">수입</button>
            <button type="button" @click="mode = 'expense'" :class="btnClass('expense')">지출</button>
        </div>

        <ul>
            <li v-for="item in filteredList" :key="item.type + '-' + item.id" class="mb-2 p-2 border rounded">
                <p>📆 {{ item.date }}</p>
                <p>
                    <span :class="item.type === 'income' ? 'text-green-600' : 'text-red-600'">
                        [{{ item.type === 'income' ? '수입' : '지출' }}]
                    </span>
                    {{ item.description }} - {{ item.amount.toLocaleString() }}원
                </p>
                <p>🏷️ {{ item.category }} / 💳 {{ item.payment_method || '---' }}</p>
            </li>
        </ul>
    </div> -->
</template>

<script setup>
import History from '@/components/History.vue';
// import { ref, computed, onMounted } from 'vue'
// import axios from 'axios'

// const mode = ref('all')
// const allList = ref([])

// const fetchData = async () => {
//     const [incomesRes, expensesRes] = await Promise.all([
//         axios.get('http://localhost:3001/incomes?user_id=1'),
//         axios.get('http://localhost:3001/expenses?user_id=1'),
//     ])

//     const incomes = incomesRes.data.map(item => ({ ...item, type: 'income' }))
//     const expenses = expensesRes.data.map(item => ({ ...item, type: 'expense' }))

//     allList.value = [...incomes, ...expenses].sort((a, b) => a.id - b.id)
// }

// const filteredList = computed(() => {
//     if (mode.value === 'all') return allList.value
//     return allList.value.filter(item => item.type === mode.value)
// })

// const btnClass = (type) => {
//     return mode.value === type
//         ? 'bg-blue-500 text-white px-4 py-2 rounded'
//         : 'bg-gray-200 text-black px-4 py-2 rounded'
// }

// onMounted(fetchData)
</script>
