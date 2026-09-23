<template>
    <PanelSection title="移动设备">
        <div class="flex justify-between px-0.5 pb-0 pt-0.5">
            <article v-for="(item, index) in mobileDevices" :key="item.name" class="grid w-[31%] justify-items-center gap-1.5">
                <span class="device-name relative inline-block text-xs text-[rgba(235,248,255,0.65)]">{{ item.name }}</span>
                <div
                    class="device-gauge relative grid size-[68px] place-items-center rounded-full"
                    :style="{
                        '--progress-target': `${item.percentage * 3.6}deg`,
                        '--progress-delay': `${index * 90}ms`,
                    }"
                >
                    <div class="relative z-[1] grid size-[42px] place-items-center"><img class="size-7 object-contain" :src="item.icon" alt="" /></div>
                </div>
                <strong class="font-vfonts text-[19px] font-medium text-[#79e3f8]"><AnimatedNumber :value="item.value" separator /></strong>
            </article>
        </div>
    </PanelSection>

    <PanelSection title="前端感知">
        <template #actions>
            <span class="flex items-baseline gap-1 text-xs text-sky-100/40">
                资源总量
                <strong class="font-vfonts text-sm font-medium text-[#83e7f8] [font-variant-numeric:tabular-nums]"><AnimatedNumber :value="perceptionTotal" separator /></strong>
            </span>
        </template>
        <div class="grid grid-cols-2 gap-x-5 gap-y-3 px-1 py-0.5">
            <article v-for="item in perceptionDevices" :key="item.name" class="group grid grid-cols-[42px_1fr] items-center gap-3">
                <span class="grid size-[42px] place-items-center border border-sky-200/10 bg-sky-400/[0.04]">
                    <img class="size-[38px] object-contain transition-transform duration-200 group-hover:scale-105" :src="item.icon" alt="" />
                </span>
                <span class="grid min-w-0 gap-1.5">
                    <span class="flex items-baseline justify-between gap-2">
                        <span class="truncate text-xs tracking-[0.04em] text-sky-50/65">{{ item.name }}</span>
                        <small class="font-vfonts text-[10px] text-sky-100/35"><AnimatedNumber :value="perceptionShare(item.value)" />%</small>
                    </span>
                    <strong class="font-vfonts text-[21px] font-medium leading-none tracking-tight text-[#83e7f8] [font-variant-numeric:tabular-nums]"><AnimatedNumber :value="item.value" separator /></strong>
                    <span class="h-px overflow-hidden bg-sky-950/80">
                        <i class="perception-progress block h-full" :style="{ width: `${perceptionShare(item.value)}%` }" />
                    </span>
                </span>
            </article>
        </div>
    </PanelSection>

    <PanelSection title="警情(24小时)">
        <template #actions>
            <span class="flex items-baseline gap-1 text-xs text-sky-100/40">
                合计
                <strong class="font-vfonts text-sm font-medium text-[#83e7f8] [font-variant-numeric:tabular-nums]"><AnimatedNumber :value="policeCaseTotal" /></strong>
                起
            </span>
        </template>
        <div class="divide-y divide-sky-200/10 border-y border-sky-200/10">
            <article
                v-for="(item) in policeCases"
                :key="item.name"
                class="group grid min-h-[54px] grid-cols-[30px_minmax(70px,0.8fr)_minmax(90px,1.4fr)_52px] items-center gap-2 px-1.5 transition-colors duration-200 hover:bg-sky-300/[0.035]"
            >
                <img class="size-7 object-contain transition-transform duration-200 group-hover:scale-105" :src="item.icon" alt="" />
                <span class="flex min-w-0 items-center gap-2">
                    <span class="truncate text-xs tracking-[0.03em] text-sky-50/75">{{ item.name }}</span>
                </span>
                <span class="flex min-w-0 items-center gap-2">
                    <span class="h-1 flex-1 overflow-hidden bg-sky-950/70">
                        <i class="case-progress-fill block h-full" :style="{ width: `${item.percentage}%` }" />
                    </span>
                    <small class="w-7 text-right font-vfonts text-[10px] text-sky-100/40"><AnimatedNumber :value="item.percentage" />%</small>
                </span>
                <strong class="text-right font-vfonts text-lg font-medium leading-none text-[#83e7f8] [font-variant-numeric:tabular-nums]">
                    <AnimatedNumber :value="item.value" /><small class="ml-1 font-sans text-[10px] font-normal text-sky-100/40">起</small>
                </strong>
            </article>
        </div>
    </PanelSection>
</template>

<script setup lang="ts">
import AnimatedNumber from '@/common/AnimatedNumber/index.vue';
import PanelSection from '@/components/screen/PanelSection.vue';
import { mobileDevices, perceptionDevices, policeCases } from '@/config/dashboard';

const perceptionTotal = perceptionDevices.reduce((total, item) => total + item.value, 0);
const policeCaseTotal = policeCases.reduce((total, item) => total + item.value, 0);
const perceptionShare = (value: number) => Math.round((value / perceptionTotal) * 100);
</script>

<style scoped>
.device-name::before,
.device-name::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background: url('/static/images/icon-left.png') center/100% 100% no-repeat;
}
.device-name::before {
    left: -15px;
    transform: translateY(-50%);
}
.device-name::after {
    right: -15px;
    transform: translateY(-50%) rotateY(180deg);
}
@property --progress-current {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}
.device-gauge::before {
    --progress-current: 0deg;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
        from 215deg,
        #32b9f4 0deg,
        #7be5f7 var(--progress-current),
        rgba(26, 67, 103, 0.46) var(--progress-current),
        rgba(26, 67, 103, 0.46) 360deg
    );
    -webkit-mask: radial-gradient(circle, transparent 57%, #000 59%);
    mask: radial-gradient(circle, transparent 57%, #000 59%);
    animation: device-progress-fill 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--progress-delay) forwards;
}
@keyframes device-progress-fill {
    from {
        --progress-current: 0deg;
    }
    to {
        --progress-current: var(--progress-target);
    }
}
@media (prefers-reduced-motion: reduce) {
    .device-gauge::before {
        --progress-current: var(--progress-target);
        animation: none;
    }
}
.perception-progress {
    background: linear-gradient(90deg, rgba(37, 142, 193, 0.58), #72e1f4);
    box-shadow: 0 0 5px rgba(75, 209, 239, 0.24);
}
.case-progress-fill {
    background: linear-gradient(90deg, #218ecc, #72e1f4);
    box-shadow: 0 0 6px rgba(75, 209, 239, 0.3);
}
</style>
