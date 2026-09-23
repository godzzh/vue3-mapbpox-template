<template>
    <article class="metric-card relative min-h-[102px]">
        <div class="metric-card__border absolute inset-0" aria-hidden="true" />
        <div class="metric-card__surface absolute inset-px" aria-hidden="true" />
        <i class="absolute left-0 top-3 z-[2] h-5 w-0.5 bg-screen-primary shadow-[0_0_8px_rgba(54,217,255,.75)]" aria-hidden="true" />
        <i class="absolute bottom-0 right-0 z-[2] h-2.5 w-2.5 bg-screen-primary/55 [clip-path:polygon(100%_0,100%_100%,0_100%)]" aria-hidden="true" />

        <div class="relative z-[3] flex h-full min-h-[102px] flex-col justify-between px-3.5 py-3">
            <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] tracking-[0.08em] text-sky-100/55">{{ label }}</span>
                <span class="h-1.5 w-1.5 bg-screen-primary/55 shadow-[0_0_6px_rgba(54,217,255,.55)]" />
            </div>
            <strong class="font-vfonts text-[24px] font-medium leading-none tracking-[-0.04em] text-sky-50 [font-variant-numeric:tabular-nums]">{{ value }}</strong>
            <div class="flex items-center gap-1.5 text-[10px] text-sky-200/45">
                <RiArrowUpSLine v-if="tone === 'up'" class="h-3.5 w-3.5 text-emerald-300/80" />
                <RiPulseLine v-else class="h-3.5 w-3.5 text-screen-primary/65" />
                <span class="truncate">{{ trend }}</span>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { RiArrowUpSLine, RiPulseLine } from '@remixicon/vue';

withDefaults(
    defineProps<{
        label: string;
        value: string;
        trend: string;
        tone?: 'up' | 'neutral';
    }>(),
    { tone: 'neutral' },
);
</script>

<style scoped>
.metric-card {
    --metric-shape: polygon(8px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 8px);
    filter: drop-shadow(0 8px 18px rgba(0, 7, 17, 0.14));
}
.metric-card__border {
    background: linear-gradient(145deg, rgba(54, 217, 255, 0.55), rgba(54, 217, 255, 0.08) 46%, rgba(102, 188, 217, 0.3));
    clip-path: var(--metric-shape);
}
.metric-card__surface {
    background: radial-gradient(circle at 84% 12%, rgba(54, 217, 255, 0.1), transparent 32%), linear-gradient(135deg, rgba(11, 43, 68, 0.92), rgba(5, 20, 37, 0.86));
    clip-path: var(--metric-shape);
}
.metric-card:hover .metric-card__border {
    background: linear-gradient(145deg, rgba(110, 231, 255, 0.8), rgba(54, 217, 255, 0.16) 48%, rgba(102, 188, 217, 0.45));
}
</style>
