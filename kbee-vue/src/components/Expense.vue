<template>
  <div class="mb-6">
    <!-- 지출 내역 섹션 제목 -->
    <h3 class="text-lg font-semibold mb-2">💸 지출 내역</h3>

    <!-- 1. 로딩 중일 때 보여주는 화면 -->
    <div v-if="transactionStore.isExpenseLoading">Loading...</div>

    <!-- 2. 에러가 발생했을 때 에러 메시지 출력 -->
    <div v-else-if="transactionStore.expenseError" class="text-red-500">
      {{ transactionStore.expenseError }}
    </div>

    <!-- 3. 지출 내역이 있을 경우 리스트로 출력 -->
    <ul v-else-if="transactionStore.expenseList.length > 0">
      <!-- 각 지출 항목을 반복 출력 -->
      <li v-for="item in transactionStore.expenseList" :key="item.id" class="mb-2 p-2 border rounded">
        <!-- 지출 날짜 -->
        <p>📆 {{ item.date }}</p>
        <!-- 지출 설명 -->
        <p>💬 {{ item.description }}</p>
        <!-- 지출 금액 (천 단위 쉼표 포함) -->
        <p>💸 {{ item.amount.toLocaleString() }}원</p>
        <!-- 카테고리와 결제수단 -->
        <p>🏷️ {{ item.category }} / 💳 {{ item.payment_method }}</p>
      </li>
    </ul>

    <!-- 4. 내역이 전혀 없을 경우 안내 메시지 출력 -->
    <p v-else>선택된 날짜에 지출 내역이 없습니다.</p>
  </div>
</template>

<script setup>
import { watch, defineProps, defineEmits } from 'vue';
// Pinia에서 트랜잭션(지출 등) 관련 상태 관리하는 store 가져오기
import { useTransactionStore } from '../stores/TransactionStore'; // 실제 경로에 맞게 수정 필요

// 부모 컴포넌트로부터 selectedDate 값을 props로 받음
const props = defineProps({
  selectedDate: {
    type: String,      // 날짜는 문자열로 전달받음 (예: '2025-04-10')
    default: null,     // 기본값은 null
  },
});

// 트랜잭션 관련 store 사용 선언
const transactionStore = useTransactionStore();

// 상위 컴포넌트에 데이터를 전달하기 위한 emit 선언
const emit = defineEmits(['expense-loaded']);

// selectedDate 값이 변경될 때마다 실행될 watch 함수
watch(
  () => props.selectedDate,              // 감시 대상: selectedDate
  async (newSelectedDate) => {           // 변경되었을 때 실행할 함수
    if (newSelectedDate) {               // null이 아닌 경우에만 실행
      // 선택한 날짜에 맞는 지출 데이터를 가져오는 함수 실행
      await transactionStore.fetchExpense(newSelectedDate);
      // 가져온 지출 내역을 상위 컴포넌트에 전달
      emit('expense-loaded', transactionStore.expenseList);
    }
  },
  { immediate: true }                    // 컴포넌트가 처음 마운트될 때도 즉시 실행
);
</script>
