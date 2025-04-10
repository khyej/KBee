<template>
  <!--화면에 꽉차게 설정하되 최대높이를 모바일에서는 400px 일반은 300px로 제한-->
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

const userStore = useUserStore(); //스토어를 받아오기
const barCanvas = ref(null); //bar 캔버스를 반응형으로 사용하기 위함
let chartInstance = null;

//chart를 보여주는 객체
const renderChart = async () => {
  try {
    if (!userStore.user?.id) return;

    //프록시에서 수입과 지출을 받아오기
    const [expensesRes, incomesRes] = await Promise.all([
      axios.get('/api/expenses'),
      axios.get('/api/incomes'),
    ]);

    const userId = userStore.user.id; //userId 변수에 스토어에 있는 유저아이디 받아오기

    // 연도별 차트 제작을 위한 12달 배열
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

    const monthlyExpenses = Array(12).fill(0); // 막대제작을 위한 지출 배열
    const monthlyIncomes = Array(12).fill(0); // 막대 제작을 위한 수입 배열

    //달별로 출력하기 위한 분류작업
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
    } //기존 차트가 있으면 먼저 없앤다

    //그래프 제작 인스턴스
    chartInstance = new Chart(barCanvas.value, {
      type: 'bar', //그래프 형태
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
        ], //막대 그래프의 데이터셋
      },
      options: {
        responsive: true, //반응성 true
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
            }, //막대그래프의 밑에 뜨는 레전드 스타일
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
