<template>
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-center gap-4"
  >
    <!-- 도넛 차트 영역 -->
    <div class="relative w-full md:w-1/2 h-full">
      <Doughnut :data="chartData" :options="options" />
    </div>

    <!-- 범례 (Legend) -->
    <div class="w-full md:w-1/2 flex flex-col justify-center pl-4">
      <h3 class="font-semibold text-gray-700 mb-2">카테고리별 지출 내역</h3>
      <ul class="space-y-2 text-sm">
        <li
          v-for="(label, index) in chartData.labels"
          :key="index"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 inline-block rounded-full"
              :style="{
                backgroundColor: chartData.datasets[0].backgroundColor[index],
              }"
            ></span>
            <span class="text-gray-800">{{ label }}</span>
          </div>
          <span class="text-gray-600 font-medium">
            {{ chartData.datasets[0].data[index].toLocaleString() }}원
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  month: String,
});

const userStore = useUserStore();

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed;
          return `${value.toLocaleString()}원`;
        },
      },
    },
  },
};

const chartData = ref({
  labels: [],
  datasets: [],
});

const getMonth = (dateStr) => dateStr.split('-')[1];

const fetchAndRender = async () => {
  try {
    if (!userStore.user?.id) return;

    const res = await axios.get('/api/expenses');
    const userId = userStore.user.id;

    const filtered = res.data.filter(
      (item) => item.user_id === userId && getMonth(item.date) === props.month
    );

    const categoryTotals = {};
    filtered.forEach((item) => {
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

<style scoped>
/* 필요 시 스타일 추가 가능 */
</style>
