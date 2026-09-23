<template>
    <span class="font-vfonts [font-variant-numeric:tabular-nums]" :aria-label="formattedTarget">{{ formattedValue }}</span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
    value: number;
    duration?: number;
    precision?: number;
    separator?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    duration: 900,
    precision: 0,
    separator: false,
});

const displayedValue = ref(0);
let animationFrame = 0;
let reduceMotionQuery: MediaQueryList | null = null;

const formatValue = (value: number) => {
    const normalizedValue = Number.isFinite(value) ? value : 0;
    return props.separator
        ? normalizedValue.toLocaleString('zh-CN', {
              minimumFractionDigits: props.precision,
              maximumFractionDigits: props.precision,
          })
        : normalizedValue.toFixed(props.precision);
};

const formattedValue = computed(() => formatValue(displayedValue.value));
const formattedTarget = computed(() => formatValue(props.value));

const stopAnimation = () => {
    if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
    }
};

const animateTo = (target: number) => {
    stopAnimation();
    const normalizedTarget = Number.isFinite(target) ? target : 0;
    if (reduceMotionQuery?.matches || props.duration <= 0) {
        displayedValue.value = normalizedTarget;
        return;
    }

    const startValue = displayedValue.value;
    const difference = normalizedTarget - startValue;
    if (!difference) return;

    const startTime = performance.now();
    const update = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / props.duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        displayedValue.value = startValue + difference * easedProgress;
        if (progress < 1) {
            animationFrame = window.requestAnimationFrame(update);
        } else {
            displayedValue.value = normalizedTarget;
            animationFrame = 0;
        }
    };
    animationFrame = window.requestAnimationFrame(update);
};

watch(() => props.value, animateTo);

onMounted(() => {
    reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    animateTo(props.value);
});

onBeforeUnmount(stopAnimation);
</script>
