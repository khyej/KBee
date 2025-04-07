<template>
    <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">📋 수입 / 지출 내역</h2>

        <div class="flex space-x-2 mb-6">
            <button type="button" @click="mode = 'all'" :class="btnClass('all')">전체</button>
            <button type="button" @click="mode = 'income'" :class="btnClass('income')">수입</button>
            <button type="button" @click="mode = 'expense'" :class="btnClass('expense')">지출</button>
        </div>

        <Income v-if="mode === 'all' || mode === 'income'" />
        <Expense v-if="mode === 'all' || mode === 'expense'" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Income from '@/components/Income.vue'
import Expense from '@/components/Expense.vue'

const mode = ref('all')

const btnClass = (type) => {
    return mode.value === type
        ? 'bg-blue-500 text-white px-4 py-2 rounded'
        : 'bg-gray-200 text-black px-4 py-2 rounded'
}
</script>