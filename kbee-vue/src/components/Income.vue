<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">💰 수입 내역</h3>
    <ul>
      <li
        v-for="item in incomeList"
        :key="item.id"
        class="mb-2 p-2 border rounded"
      >
        <p>📆 {{ item.date }}</p>
        <p>💬 {{ item.description }}</p>
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <p>🏷️ {{ item.category }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, watch, defineProps, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  selectedDate: {
    type: String,
    default: null, // Make the prop optional with a default value of null
  },
});

const incomeList = ref([]);
const emit = defineEmits(['income-loaded']);

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

const fetchIncome = async (formattedDate) => {
  try {
    const params = { user_id: 1 };
    if (formattedDate) {
      params.date = formattedDate;
    }
    const res = await axios.get('/api/incomes', { params });
    incomeList.value = res.data;
    emit('income-loaded', res.data);
  } catch (error) {
    console.error('Error fetching income:', error);
  }
};

watch(
  () => props.selectedDate,
  (newSelectedDate) => {
    const formattedDate = convertToYYYYMMDD(newSelectedDate);
    fetchIncome(formattedDate);
  },
  { immediate: true }
);
</script>
