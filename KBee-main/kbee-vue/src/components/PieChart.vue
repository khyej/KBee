<template>
  <div class="relative">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// 차트 옵션
const options = {
  responsive: true,

  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const chartData = ref({
  labels: [],
  datasets: [],
});

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/expenses');
    const expenses = await res.json();

    const categoryTotals = {};
    expenses.forEach((item) => {
      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) + item.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    console.log('✅ labels:', labels);
    console.log('✅ data:', data);

    const backgroundColors = [
      '#f87171',
      '#60a5fa',
      '#facc15',
      '#34d399',
      '#a78bfa',
      '#fbbf24',
      '#818cf8',
    ];

    chartData.value = {
      labels,
      datasets: [
        {
          label: '카테고리별 지출',
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
        },
      ],
    };
  } catch (error) {
    console.error('❌ onMounted 에러:', error);
  }
});
</script>
