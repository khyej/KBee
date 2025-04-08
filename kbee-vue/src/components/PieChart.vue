<template>
  <div class="relative">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  month: String,
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
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

const fetchAndRender = async () => {
  try {
    const res = await fetch('/api/expenses');
    const expenses = await res.json();

    const getMonth = (dateStr) => dateStr.split('-')[1];
    const filteredExpenses = expenses.filter(
      (item) => getMonth(item.date) === props.month
    );

    const categoryTotals = {};
    filteredExpenses.forEach((item) => {
      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) + item.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const backgroundColors = [
      '#FCA5A5',
      '#60A5FA',
      '#6EE7B7',
      '#FCD34D',
      '#A5B4FC',
      '#FB7185',
      '#67E8F9',
      '#BEF264',
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
    console.error('❌ PieChart 데이터 로딩 에러:', error);
  }
};

onMounted(fetchAndRender);
watch(() => props.month, fetchAndRender);
</script>
