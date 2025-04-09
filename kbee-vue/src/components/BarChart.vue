<template>
  <div class="relative w-full h-[300px] md:h-[400px]">
    <canvas ref="barCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const userStore = useUserStore();
const barCanvas = ref(null);
let chartInstance = null;

const renderChart = async () => {
  try {
    if (!userStore.user?.id) return;

    const [expensesRes, incomesRes] = await Promise.all([
      axios.get('/api/expenses'),
      axios.get('/api/incomes'),
    ]);

    const userId = userStore.user.id;

    const monthLabels = [
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

    const monthlyExpenses = Array(12).fill(0);
    const monthlyIncomes = Array(12).fill(0);

    expensesRes.data.forEach((item) => {
      if (item.user_id === userId) {
        const month = new Date(item.date).getMonth(); // 0~11
        monthlyExpenses[month] += item.amount;
      }
    });

    incomesRes.data.forEach((item) => {
      if (item.user_id === userId) {
        const month = new Date(item.date).getMonth(); // 0~11
        monthlyIncomes[month] += item.amount;
      }
    });

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: '수입',
            data: monthlyIncomes,
            backgroundColor: '#4ADE80',
            categoryPercentage: 0.6,
            barPercentage: 0.8,
          },
          {
            label: '지출',
            data: monthlyExpenses,
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
            labels: {
              boxWidth: 12,
              padding: 16,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${
                  context.dataset.label
                }: ${context.parsed.y.toLocaleString()}원`,
            },
          },
        },
        scales: {
          x: {
            stacked: false,
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value.toLocaleString()}원`,
            },
          },
        },
      },
    });
  } catch (err) {
    console.error('📉 월별 바 차트 로딩 실패:', err);
  }
};

onMounted(renderChart);
</script>
