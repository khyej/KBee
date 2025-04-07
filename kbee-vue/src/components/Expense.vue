<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">💸 지출 내역</h3>
    <ul>
      <li v-for="item in expenseList" :key="item.id" class="mb-2 p-2 border rounded">
        <p>📆 {{ item.date }}</p>
        <p>💬 {{ item.description }}</p>
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <p>🏷️ {{ item.category }} / 💳 {{ item.payment_method }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const expenseList = ref([])

const fetchExpense = async () => {
  const res = await axios.get('http://localhost:3001/expenses?user_id=1')
  expenseList.value = res.data
}

onMounted(fetchExpense)
</script>
