<template>
  <!-- 수입 내역 전체 박스 -->
  <div class="mb-6">
    <!-- 제목 -->
    <h3 class="text-lg font-semibold mb-2">💰 수입 내역</h3>

    <!-- 로딩 상태일 때 메시지 -->
    <div v-if="transactionStore.isIncomeLoading">Loading...</div>

    <!-- 에러 발생 시 메시지 -->
    <div v-else-if="transactionStore.incomeError" class="text-red-500">
      {{ transactionStore.incomeError }}
    </div>

    <!-- 수입 데이터가 있을 경우 리스트 출력 -->
    <ul v-else-if="transactionStore.incomeList.length > 0">
      <li v-for="item in transactionStore.incomeList" :key="item.id" class="mb-2 p-2 border rounded">
        <p>📆 {{ item.date }}</p>
        <p>💬 {{ item.description }}</p>
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <p>🏷️ {{ item.category }}</p>
      </li>
    </ul>

    <!-- 수입 내역이 없는 경우 표시 -->
    <p v-else>선택된 날짜에 수입 내역이 없습니다.</p>
  </div>
</template>

<script setup>
// Vue API import
import { watch, defineProps, getCurrentInstance } from 'vue';
// 수입 관련 데이터를 관리하는 Store
import { useTransactionStore } from '../stores/TransactionStore'; // 경로는 프로젝트 구조에 따라 조정 필요

// 외부에서 전달받는 props 정의
const props = defineProps({
  selectedDate: {
    type: String,
    default: null,
  },
});

// Pinia store 인스턴스 사용
const transactionStore = useTransactionStore();

// 현재 컴포넌트 인스턴스에서 emit 가져오기 (Composition API 방식)
const { emit } = getCurrentInstance();

// 선택된 날짜가 변경될 때마다 fetchIncome 실행
watch(
  () => props.selectedDate,
  async (newSelectedDate) => {
    if (newSelectedDate) {
      // 해당 날짜의 수입 내역 불러오기
      await transactionStore.fetchIncome(newSelectedDate);
      // 부모 컴포넌트로 수입 리스트 전달
      emit('income-loaded', transactionStore.incomeList);
    }
  },
  { immediate: true } // 컴포넌트 마운트 시에도 바로 실행되도록 설정
);
</script>
