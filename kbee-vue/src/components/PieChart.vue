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
            <span class="text-xs text-gray-500">
              ({{ percentages[index] }}%)
            </span>
          </div>
          <div class="flex flex-col items-end text-right">
            <span class="text-gray-600 font-medium">
              {{ chartData.datasets[0].data[index].toLocaleString() }}원
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  month: String,
});

const userStore = useUserStore();

const chartData = ref({
  labels: [],
  datasets: [],
});

const total = ref(0);

const percentages = computed(() => {
  const data = chartData.value.datasets[0]?.data || [];
  return data.map((value) =>
    total.value > 0 ? ((value / total.value) * 100).toFixed(1) : '0.0'
  );
});

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

    // ✅ 내림차순 정렬된 배열로 변환
    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    ); // amount 기준 내림차순 정렬

    const labels = sortedCategories.map(([category]) => category);
    const data = sortedCategories.map(([_, amount]) => amount);
    total.value = data.reduce((sum, val) => sum + val, 0);

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

// 👉 export 해서 템플릿에서 사용할 수 있도록!
defineExpose({ chartData, percentages, total });
</script>

<style scoped>
/* 필요 시 스타일 추가 가능 */
</style>
