<template>
    <div class="modal2" :class="customClass" v-if="visible">
        <div class="modal2-overlay" @click="$emit('close')" :class="customClass"></div>
        <div class="modal2-content" :class="customClass">
            <template v-if="!isEditing">
                <div class="form-body">
                    <div class="form-row">
                        <div class="form-date">{{ selectedItem.date }}</div>
                    </div>
                    <div class="form-row">
                        <div class="form-title">분류</div>
                        <div class="form-data">
                            {{ selectedItem.type === 'expense' ? '지출' : '수입' }}
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-title">카테고리</div>
                        <div class="form-data">{{ selectedItem.category }}</div>
                    </div>
                    <div class="form-row">
                        <div class="form-title">내용</div>
                        <div class="form-data">
                            {{ selectedItem.description }}
                        </div>
                    </div>
                    <div class="form-row" v-if="form.type === 'expense'">
                        <div class="form-title">지출수단</div>
                        <div class="form-data">
                            {{ selectedItem.payment_method }}
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-title">금액</div>
                        <div class="form-data">{{ selectedItem.amount.toLocaleString() }}원</div>
                    </div>
                </div>
                <div class="form-actions">
                    <div class="left">
                        <button @click="isEditing = true">수정</button>
                        <button @click="$emit('delete')">삭제</button>
                    </div>
                    <div class="right">
                        <button @click="$emit('close')">닫기</button>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="form-body">
                    <div class="form-row">
                        <div class="form-date">수정</div>
                    </div>
                    <div class="form-row">
                        <div class="form-title">날짜</div>
                        <input v-model="form.date" type="date" class="form-data" />
                    </div>
                    <div class="form-row">
                        <div class="form-title">분류</div>
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
                        <input v-model="form.description" type="text" class="form-data" />
                    </div>
                    <div class="form-row" v-if="form.type === 'expense'">
                        <div class="form-title">지출수단</div>
                        <input v-model="form.payment_method" type="text" class="form-data" />
                    </div>
                    <div class="form-row">
                        <div class="form-title">금액</div>
                        <input v-model.number="form.amount" type="number" class="form-data" />
                    </div>
                </div>
                <div class="form-actions">
                    <div class="left"></div>
                    <div class="right">
                        <button @click="$emit('save', { ...form })">저장</button>
                        <button @click="isEditing = false">취소</button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    visible: Boolean,
    selectedItem: Object,
    incomeCategories: Array,
    expenseCategories: Array,
    customClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['close', 'delete', 'save']);

const isEditing = ref(false);
const form = ref({ ...props.selectedItem });

watch(
    () => props.selectedItem,
    (val) => {
        form.value = { ...val };
        isEditing.value = false;
    }
);
</script>

<style scoped>
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

.form-actions .left {
    display: flex;
    gap: 1rem;
}

.form-actions .right {
    display: flex;
    gap: 1rem;
}

.form-actions .left button:first-child {
    background-color: rgb(255, 204, 0);
    color: white;
}

.form-actions .left button:last-child {
    background-color: rgb(96, 88, 76);
    color: white;
}

.form-actions .right button:first-child {
    background-color: rgb(255, 188, 0);
    color: white;
}

.form-actions .right button:last-child {
    background-color: rgb(96, 88, 76);
    color: white;
}

::v-deep(.modal2.history) {
    width: 380px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

::v-deep(.modal2-content.history) {
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

::v-deep(.modal2.cal) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
}

::v-deep(.modal2-overlay.cal) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

::v-deep(.modal2-content.cal) {
    position: relative;
    z-index: 2;
    background: white;
    width: 90%;
    max-width: 350px;
    max-height: 600px;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1110px) {
    ::v-deep(.modal2.history) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
    }

    ::v-deep(.modal2-overlay.history) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    ::v-deep(.modal2-content.history) {
        position: relative;
        z-index: 2;
        background: white;
        width: 90%;
        max-width: 350px;
        max-height: 600px;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
}
</style>
