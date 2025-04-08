<template>
    <div>
        <div class="flex gap-2 mb-4">
            <button @click="mode = 'all'" :class="btnClass('all')">전체</button>
            <button @click="mode = 'income'" :class="btnClass('income')">수입</button>
            <button @click="mode = 'expense'" :class="btnClass('expense')">지출</button>
        </div>

        <!-- 추가 버튼 -->
        <button @click="showAddModal = true" class="bg-green-500 text-white px-4 py-2 rounded mb-4">항목 추가</button>

        <!-- 항목 리스트 -->
        <div class="mt-6">
            <div v-for="item in filteredList" :key="item.id" class="border p-2 mb-2 rounded relative">
                <div class="flex justify-between">
                    <div>
                        <p><strong>{{ item.amount.toLocaleString() }}원</strong> - {{ item.category }} | {{
                            item.description }}</p>
                        <p class="text-sm text-gray-500">{{ item.date }}</p>
                    </div>
                    <button @click="openEditModal(item)" class="text-blue-500">편집</button>
                </div>
            </div>
        </div>

        <!-- 추가 모달 -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow w-full max-w-md">
                <h3 class="text-lg font-semibold mb-4">항목 추가</h3>
                <form @submit.prevent="handleSubmit" class="space-y-2">
                    <input v-model="form.amount" type="number" placeholder="금액" required
                        class="border px-2 py-1 w-full" />
                    <input v-model="form.category" type="text" placeholder="카테고리" required
                        class="border px-2 py-1 w-full" />
                    <input v-if="mode === 'expense'" v-model="form.payment_method" type="text" placeholder="결제수단"
                        class="border px-2 py-1 w-full" />
                    <input v-model="form.description" type="text" placeholder="설명" class="border px-2 py-1 w-full" />
                    <input v-model="form.date" type="date" required class="border px-2 py-1 w-full" />
                    <div class="flex justify-end gap-2 mt-4">
                        <button type="button" @click="showAddModal = false" class="text-gray-500">취소</button>
                        <button type="submit" class="bg-green-500 text-white px-4 py-1 rounded">추가</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 편집 모달 -->
        <div v-if="editingItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow w-full max-w-md">
                <h3 class="text-lg font-semibold mb-4">항목 수정</h3>
                <input v-model="editForm.amount" type="number" placeholder="금액" class="border px-2 py-1 w-full mb-2" />
                <input v-model="editForm.category" type="text" placeholder="카테고리"
                    class="border px-2 py-1 w-full mb-2" />
                <input v-if="editingItem.type === 'expense'" v-model="editForm.payment_method" type="text"
                    placeholder="결제수단" class="border px-2 py-1 w-full mb-2" />
                <input v-model="editForm.description" type="text" placeholder="설명"
                    class="border px-2 py-1 w-full mb-2" />
                <input v-model="editForm.date" type="date" class="border px-2 py-1 w-full mb-2" />
                <div class="flex justify-end gap-2">
                    <button @click="cancelEdit" class="text-gray-500">취소</button>
                    <button @click="deleteItem(editingItem)" class="bg-red-500 text-white px-4 py-1 rounded">삭제</button>
                    <button @click="applyEdit(editingItem)"
                        class="bg-yellow-500 text-white px-4 py-1 rounded">수정</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const mode = ref('all')
const incomes = ref([])
const expenses = ref([])
const showAddModal = ref(false)
const editingItem = ref(null)
const editForm = reactive({
    amount: '',
    category: '',
    payment_method: '',
    description: '',
    date: ''
})

const form = reactive({
    amount: '',
    category: '',
    payment_method: '',
    description: '',
    date: ''
})

const fetchData = async () => {
    const res1 = await axios.get('http://localhost:3001/incomes?user_id=1')
    const res2 = await axios.get('http://localhost:3001/expenses?user_id=1')
    incomes.value = res1.data.map(i => ({ ...i, type: 'income' }))
    expenses.value = res2.data.map(e => ({ ...e, type: 'expense' }))
}

onMounted(fetchData)

const filteredList = computed(() => {
    if (mode.value === 'income') return [...incomes.value].sort(byId)
    if (mode.value === 'expense') return [...expenses.value].sort(byId)
    return [...incomes.value, ...expenses.value].sort(byId)
})

const byId = (a, b) => Number(a.id) - Number(b.id)

const getNextId = (list) => {
    const ids = list.map(item => Number(item.id))
    const max = ids.length ? Math.max(...ids) : 0
    return String(max + 1)
}

const handleSubmit = async () => {
    const data = {
        id: getNextId([...incomes.value, ...expenses.value]),
        user_id: '1',
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        date: form.date
    }
    if (mode.value === 'expense') data.payment_method = form.payment_method
    const url = `http://localhost:3001/${mode.value}s`
    await axios.post(url, data)
    Object.assign(form, { amount: '', category: '', payment_method: '', description: '', date: '' })
    showAddModal.value = false
    await fetchData()
}

const deleteItem = async (item) => {
    const url = `http://localhost:3001/${item.type}s/${item.id}`
    await axios.delete(url)
    await fetchData()
    editingItem.value = null
}

const openEditModal = (item) => {
    editingItem.value = { ...item }
    Object.assign(editForm, item)
}

const cancelEdit = () => {
    editingItem.value = null
}

const applyEdit = async (item) => {
    const url = `http://localhost:3001/${item.type}s/${item.id}`
    const updated = {
        ...item,
        amount: Number(editForm.amount),
        category: editForm.category,
        description: editForm.description,
        date: editForm.date
    }
    if (item.type === 'expense') updated.payment_method = editForm.payment_method
    await axios.put(url, updated)
    await fetchData()
    editingItem.value = null
}

const btnClass = (type) => {
    return mode.value === type
        ? 'bg-blue-500 text-white px-4 py-1 rounded'
        : 'bg-gray-200 text-black px-4 py-1 rounded'
}
</script>

<style scoped>
input {
    display: block;
    width: 100%;
}
</style>
