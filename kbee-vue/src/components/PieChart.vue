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
      '#FCA5A5', // 연한 빨강 (식비 등)
      '#60A5FA', // 중간 파랑 (주거·공과금)
      '#6EE7B7', // 연한 초록 (교통 등)
      '#FCD34D', // 연한 노랑 (쇼핑 등)
      '#A5B4FC', // 연한 보라 (문화생활 등)
      '#FB7185', // 진한 핑크 (카페·디저트)
      '#67E8F9', // 연한 청록
      '#BEF264', // 연한 라임그린
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
