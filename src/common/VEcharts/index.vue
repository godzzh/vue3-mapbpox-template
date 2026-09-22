<template>
    <div ref="el" class="echarts-container w-full h-full"></div>
</template>
<script setup lang="ts">
import { shallowRef, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
// 按需引入 echarts：只打包用到的图表与组件（较全量引入可减 60%+ 体积）
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    DatasetComponent,
    TransformComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';
import { useElementSize } from '@vueuse/core';

echarts.use([
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    DatasetComponent,
    TransformComponent,
    CanvasRenderer,
]);

const props = withDefaults(
    defineProps<{
        /** ECharts 官方配置；由业务组件负责数据和视觉配置。 */
        options?: EChartsCoreOption;
        autoPlay?: boolean;
    }>(),
    {
        options: () => ({}),
        autoPlay: false,
    }
);

const emit = defineEmits<{
    (e: 'itemClick', params: unknown): void;
}>();

const el = ref<HTMLDivElement | null>(null);
const myChart = shallowRef<EChartsType | null>(null);
const { width, height } = useElementSize(el);

let playTimer: ReturnType<typeof setInterval> | null = null;
let currentIndex = 0;

const setOptions = () => {
    const options = props.options || {};
    myChart.value?.setOption({
        color: [
            '#36D9FF',
            '#FF9671',
            '#FFC75F',
            '#00C9A7',
            '#EE003F',
            '#BFA975',
            '#BBCCFF',
            '#6AFBCF',
            '#AD3AED',
            '#829DFF',
            '#FF586F',
            '#00A4FF',
            '#59BAB8',
            '#C1554D',
        ],
        // 全局字体样式
        textStyle: {
            fontFamily: 'Fira Sans, sans-serif',
            fontSize: 12,
        },
        animationEasing: 'elasticOut',
        ...options,
        tooltip: {
            className: 'echarts-tooltip',
            extraCssText: 'z-index: 888;',
            ...(options.tooltip || {}),
        },
        grid: {
            top: '20px',
            left: '10px',
            containLabel: true,
            bottom: '10px',
            right: '10px',
            ...(options.grid || {}),
        },
    } as EChartsCoreOption);
};

const stopPlay = () => {
    if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
    }
};

const autoPlaySelect = () => {
    const chart = myChart.value;
    const series = props.options?.series;
    if (!chart || !Array.isArray(series)) return;
    const dataLen = (series[0]?.data as unknown[] | undefined)?.length ?? 0;
    if (!dataLen) return;
    chart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: currentIndex });
    currentIndex = (currentIndex + 1) % dataLen;
    chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: currentIndex });
    chart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: currentIndex });
};

watch(
    () => props.options,
    () => {
        myChart.value?.clear();
        currentIndex = 0;
        nextTick(() => setOptions());
    },
    { deep: true }
);

// 容器尺寸变化自适应（useElementSize 基于 ResizeObserver，已覆盖窗口缩放场景，无需 window 监听）
watch([width, height], () => myChart.value?.resize());

onMounted(() => {
    if (!el.value) return;
    const chart = echarts.init(el.value);
    myChart.value = chart;

    chart.on('click', (params) => emit('itemClick', params));
    nextTick(() => setOptions());

    if (!props.autoPlay) return;

    chart.on('mouseover', () => {
        chart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: currentIndex });
        stopPlay();
    });
    chart.on('mouseout', () => {
        stopPlay();
        playTimer = setInterval(autoPlaySelect, 4000);
    });
    playTimer = setInterval(autoPlaySelect, 4000);
});

onBeforeUnmount(() => {
    stopPlay();
    myChart.value?.dispose();
    myChart.value = null;
});
</script>
<style lang="less">
.echarts-tooltip:empty:not([style]) {
    display: none;
}

.echarts-tooltip[style] {
    border: 1px solid rgba(91, 192, 224, 0.46) !important;
    border-radius: 2px !important;
    box-shadow: 0 0 8px rgba(54, 217, 255, 0.16) !important;
    min-width: 80px !important;
}
</style>
