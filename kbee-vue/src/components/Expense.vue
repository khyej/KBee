<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">💸 지출 내역</h3>
    <ul>
      <li
        v-for="item in expenseList"
        :key="item.id"
        class="mb-2 p-2 border rounded"
      >
        <p>📆 {{ item.date }}</p>
        <p>💬 {{ item.description }}</p>
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <p>🏷️ {{ item.category }} / 💳 {{ item.payment_method }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['expense-loaded']); // Define the custom event

const expenseList = ref([]);

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

  const [monthStr, dayStr, yearStr] = dateStr.split(/[\s,]+/);
  const monthIndex = monthNames.indexOf(monthStr);
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
    console.error('Invalid date format:', dateStr);
    return null;
  }

  const month = (monthIndex + 1).toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  return `${year}-${month}-${formattedDay}`;
};

const fetchExpense = async (formattedDate) => {
  try {
    const params = { user_id: 1 };
    if (formattedDate) {
      params.date = formattedDate;
    }
    const res = await axios.get('/api/expenses', { params });
    expenseList.value = res.data;
    emit('expense-loaded', res.data); // Emit the event with the data
  } catch (error) {
    console.error('Error fetching expense:', error);
  }
};

watch(
  () => props.selectedDate,
  (newSelectedDate) => {
    const formattedDate = convertToYYYYMMDD(newSelectedDate);
    fetchExpense(formattedDate);
  },
  { immediate: true }
);
</script>
