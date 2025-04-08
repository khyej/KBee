<template>
  <div class="relative w-full">
    <canvas ref="barCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import axios from 'axios';

const props = defineProps({
  month: String,
});

const barCanvas = ref(null);
let chartInstance = null;

const renderChart = async () => {
  try {
    const [expensesRes, incomesRes] = await Promise.all([
      axios.get('/api/expenses'),
      axios.get('/api/incomes'),
    ]);

    const expenses = expensesRes.data;
    const incomes = incomesRes.data;

    const getMonth = (dateStr) => dateStr.split('-')[1];

    const filteredExpenses = expenses.filter(
      (item) => getMonth(item.date) === props.month
    );
    const filteredIncomes = incomes.filter(
      (item) => getMonth(item.date) === props.month
    );

    const expenseCategories = {};
    const incomeCategories = {};

    filteredExpenses.forEach((item) => {
      expenseCategories[item.category] =
        (expenseCategories[item.category] || 0) + item.amount;
    });

    filteredIncomes.forEach((item) => {
      incomeCategories[item.category] =
        (incomeCategories[item.category] || 0) + item.amount;
    });

    const allCategories = Array.from(
      new Set([
        ...Object.keys(expenseCategories),
        ...Object.keys(incomeCategories),
      ])
    );

    const expenseData = allCategories.map((cat) => expenseCategories[cat] || 0);
    const incomeData = allCategories.map((cat) => incomeCategories[cat] || 0);

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels: allCategories,
        datasets: [
          {
            label: '수입',
            data: incomeData,
            backgroundColor: '#4ADE80',
          },
          {
            label: '지출',
            data: expenseData,
            backgroundColor: '#F87171',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  } catch (error) {
    console.error('📊 바 차트 로딩 오류:', error);
  }
};

onMounted(renderChart);
watch(() => props.month, renderChart);
</script>
