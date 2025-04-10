<template>
    <div class="modal" v-if="visible">
        <div class="modal-overlay" @click="visible = false"></div>
        <div class="modal-content">
            <div class="form-body">
                <div class="form-row">
                    <div class="form-date">항목 추가</div>
                </div>
                <div class="form-row">
                    <div class="form-title">날짜</div>
                    <input type="date" v-model="form.date" class="form-data" />
                </div>
                <div class="form-row">
                    <div class="form-title">유형</div>
                    <select v-model="form.type" class="form-data">
                        <option value="income">수입</option>
                        <option value="expense">지출</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-title">카테고리</div>
                    <select v-model="form.category" class="form-data">
                        <option disabled value="">카테고리 선택</option>
                        <option
                            v-for="cat in form.type === 'income'
                                ? incomeCategories
                                : expenseCategories"
                            :key="cat.id"
                            :value="cat.name"
                        >
                            {{ cat.name }}
                        </option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-title">내용</div>
                    <input type="text" v-model="form.description" class="form-data" />
                </div>
                <div class="form-row" v-if="form.type === 'expense'">
                    <div class="form-title">결제 수단</div>
                    <input type="text" v-model="form.payment_method" class="form-data" />
                </div>
                <div class="form-row">
                    <div class="form-title">금액</div>
                    <input type="number" v-model="form.amount" class="form-data" />
                </div>
            </div>
            <div class="form-actions">
                <div class="left"></div>
                <div class="right">
                    <button type="button" @click="handleSubmit">저장</button>
                    <button type="button" @click="emit('close')">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user'; // userStore를 import

const props = defineProps({
    visible: Boolean,
    incomeCategories: Array,
    expenseCategories: Array,
    customClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['close', 'submitted']);

const form = reactive({
    date: '',
    type: 'income',
    category: '',
    description: '',
    amount: '',
    payment_method: '', // 지출 항목에만 추가
    user_id: '', // user_id 추가
});

// const mode = ref('income'); // 기본값은 'income'

// userStore에서 user_id를 가져오기
const userStore = useUserStore();
form.user_id = userStore.user?.id; // user_id를 form에 추가

const handleSubmit = async () => {
    try {
        const newItem = {
            date: form.date,
            type: form.type,
            category: form.category,
            description: form.description,
            amount: form.amount,
            user_id: form.user_id,
        };

        if (form.type === 'expense') {
            newItem.payment_method = form.payment_method;
        }

        // 새로운 항목을 db.json에 추가
        const response = await axios.post(`/api/${newItem.type}s`, newItem);

        // 부모 컴포넌트에 'submitted' 이벤트로 항목 전달
        emit('submitted', response.data);

        // 모달 닫기
        props.visible = false;
    } catch (error) {
        console.error('아이템 추가 실패:', error);
    }
};

// selectedItem이 변경될 때마다 form 초기화
watch(
    () => props.selectedItem,
    (newVal) => {
        if (newVal) {
            form.date = newVal.date;
            form.type = newVal.type;
            form.category = newVal.category;
            form.description = newVal.description;
            form.amount = newVal.amount;
            form.payment_method = newVal.payment_method || ''; // 지출 항목에 결제 수단
        }
    },
    { immediate: true }
);
</script>

<style scoped>
/* 필요 시 스타일 추가 */
.form-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
    font-size: 14px;
}

.form-date {
    width: 100%;
    text-align: center;
    font-size: 18px;
    padding: 10px;
    border-bottom: 1px solid black;
}

.form-title {
    width: 35%;
    text-align: center;
    padding: 5px;
    border-left: 5px solid rgb(255, 204, 0);
    margin-left: 10px;
}

.form-data {
    width: 65%;
    padding: 5px;
    border-bottom: 1px solid black;
    margin-right: 10px;
    word-break: keep-all;
}

.form-body {
    flex: 1;
    overflow-y: auto;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: auto;
}

.form-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
}

.form-actions .left,
.form-actions .right {
    display: flex;
    gap: 1rem;
}

/* 버튼 색상 */
.form-actions .left button:first-child {
    background-color: rgb(255, 204, 0);
    color: white;
}

.form-actions .left button:last-child,
.form-actions .right button:last-child {
    background-color: rgb(96, 88, 76);
    color: white;
}

.form-actions .right button:first-child {
    background-color: rgb(255, 188, 0);
    color: white;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    width: 90%;
    max-width: 350px;
    max-height: 500px;
    overflow-y: auto;
}
</style>
