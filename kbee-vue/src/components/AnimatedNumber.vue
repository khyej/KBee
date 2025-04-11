<template>
  <span>{{ displayValue.toLocaleString() }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  to: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 1000, // 애니메이션 시간
  },
});

const displayValue = ref(0);
let startTime = null;

const animate = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const progress = Math.min((timestamp - startTime) / props.duration, 1);
  displayValue.value = Math.floor(props.to * progress);
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
};

watch(
  () => props.to,
  () => {
    startTime = null;
    requestAnimationFrame(animate);
  },
  { immediate: true }
);
</script>
