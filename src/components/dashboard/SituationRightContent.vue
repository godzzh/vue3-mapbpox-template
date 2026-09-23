<template>
    <PanelSection title="重点路段视频">
        <div class="grid grid-cols-2 gap-[7px]">
            <article v-for="camera in cameras" :key="camera.name" class="video-card relative flex h-[82px] flex-col justify-end gap-0.5 overflow-hidden border border-[rgba(80,171,205,0.2)] p-2">
                <div class="absolute right-[7px] top-1.5 flex items-center gap-1 text-xs text-[rgba(238,250,255,0.66)]"><span class="size-[5px] rounded-full bg-[#5fe5a1] shadow-[0_0_5px_#5fe5a1]" />实时</div>
                <strong class="z-[1] text-xs font-medium">{{ camera.name }}</strong>
                <span class="z-[1] text-xs text-[rgba(225,243,251,0.45)]">{{ camera.status }}</span>
            </article>
        </div>
    </PanelSection>
    <PanelSection title="实时预警事件">
        <ul class="m-0 list-none p-0">
            <li v-for="item in realtimeWarnings" :key="item.name" class="grid min-h-[46px] grid-cols-[5px_1fr_auto] items-center gap-[9px] border-b border-[rgba(120,193,223,0.09)]">
                <i class="h-[22px] w-1" :class="warningLevelClasses[item.level]" />
                <div class="grid gap-[3px]"><strong class="text-xs font-medium">{{ item.name }}</strong><span class="text-xs text-[rgba(222,241,250,0.47)]">{{ item.area }}</span></div>
                <time class="font-vfonts text-xs text-[rgba(222,241,250,0.47)]">{{ item.time }}</time>
            </li>
        </ul>
    </PanelSection>
    <PanelSection title="风险高发区域TOP10">
        <ol class="m-0 grid list-none grid-cols-[minmax(0,1fr)] p-0">
            <li v-for="(item,index) in riskAreas" :key="item.name" class="grid min-h-[34px] grid-cols-[28px_minmax(76px,auto)_1fr_30px] items-center gap-2 border-b border-[rgba(120,193,223,0.07)] text-xs">
                <b class="font-vfonts text-xs font-medium" :class="index < 3 ? 'text-[#f1c675] [text-shadow:0_0_7px_rgba(241,198,117,0.24)]' : 'text-[#67d8ef]'">{{ String(index+1).padStart(2,'0') }}</b>
                <span class="overflow-hidden text-ellipsis whitespace-nowrap text-[rgba(233,247,253,0.68)]">{{ item.name }}</span>
                <div class="h-[5px] overflow-hidden bg-[rgba(32,72,106,0.55)]"><i class="risk-fill block h-full" :style="{ width: `${item.value}%` }" /></div>
                <strong class="text-right font-vfonts text-xs font-medium text-[#92e5f4]">{{ item.value }}</strong>
            </li>
        </ol>
    </PanelSection>
</template>
<script setup lang="ts">
import PanelSection from '@/components/screen/PanelSection.vue';
import { realtimeWarnings, riskAreas } from '@/config/dashboard';
const cameras = [
    { name:'长江北路', status:'交通运行正常' },
    { name:'建设中路', status:'车流量较高' },
    { name:'红旗广场', status:'重点区域巡查' },
    { name:'云龙大道', status:'交通运行正常' },
];
const warningLevelClasses = {
    高: 'bg-[#ff626f]',
    中: 'bg-[#f4b44c]',
    低: 'bg-[#5ee3a3]',
} as const;
</script>
<style scoped>
.video-card {
    background: linear-gradient(180deg,rgba(15,53,82,.08),rgba(3,19,39,.86)),radial-gradient(circle at 60% 30%,rgba(52,145,180,.3),transparent 42%),linear-gradient(135deg,#102d47,#07192e);
}
.video-card::before {
    content:'';
    position:absolute;
    inset:0;
    opacity:.13;
    background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(124,218,238,.25) 3px 4px);
}
.risk-fill {
    background:linear-gradient(90deg,#2586bb,#67daee);
    box-shadow:0 0 6px rgba(103,218,238,.14);
}
</style>
