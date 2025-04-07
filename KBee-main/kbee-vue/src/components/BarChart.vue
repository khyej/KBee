<template>
  <div class="relative">
    <canvas ref="barCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const barCanvas = ref(null);

onMounted(async () => {
  const [expensesRes, incomesRes] = await Promise.all([
    fetch('http://localhost:3000/expenses'),
    fetch('http://localhost:3000/incomes'),
  ]);

  const expenses = await expensesRes.json();
  const incomes = await incomesRes.json();

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

  new Chart(barCanvas.value, {
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

      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
});
</script>
