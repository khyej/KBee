<template>
  <div class="relative w-full h-[300px] md:h-[400px]">
    <canvas ref="barCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
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

const props = defineProps({
  month: String,
});

const userStore = useUserStore();
const barCanvas = ref(null);
let chartInstance = null;

const formatLabel = (label) =>
  label.includes('/') ? label.split('/') : [label];

const getMonth = (dateStr) => dateStr.split('-')[1];

const renderChart = async () => {
  try {
    if (!userStore.user?.id) return;

    const [expensesRes, incomesRes] = await Promise.all([
      axios.get('/api/expenses'),
      axios.get('/api/incomes'),
    ]);

    const userId = userStore.user.id;
    const expenses = expensesRes.data.filter(
      (item) => item.user_id === userId && getMonth(item.date) === props.month
    );
    const incomes = incomesRes.data.filter(
      (item) => item.user_id === userId && getMonth(item.date) === props.month
    );

    const expenseCategories = {};
    const incomeCategories = {};

    expenses.forEach((item) => {
      expenseCategories[item.category] =
        (expenseCategories[item.category] || 0) + item.amount;
    });

    incomes.forEach((item) => {
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
            label: formatLabel('수입'),
            data: incomeData,
            backgroundColor: '#4ADE80',
            categoryPercentage: 0.6,
            barPercentage: 0.8,
          },
          {
            label: formatLabel('지출'),
            data: expenseData,
            backgroundColor: '#F87171',
            categoryPercentage: 0.6,
            barPercentage: 0.8,
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
        scales: {
          x: {
            offset: true, // ✅ 추가
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (err) {
    console.error('📉 바 차트 로딩 실패:', err);
  }
};

onMounted(renderChart);
watch(() => props.month, renderChart);
</script>
