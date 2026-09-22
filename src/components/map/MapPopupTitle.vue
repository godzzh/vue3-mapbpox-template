<template>
    <header class="map-popup-title relative flex min-h-8 items-center gap-[9px] pb-[11px]">
        <span class="map-popup-title__marker h-[17px] w-[5px] shrink-0 box-border" aria-hidden="true" />
        <strong class="text-[15px] font-medium leading-5 tracking-[0.08em] text-[#eefbff]">{{ title }}</strong>
        <span class="map-popup-title__track absolute -bottom-px right-0 h-[3px] w-[54px] overflow-hidden" aria-hidden="true"><i /></span>
    </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<style scoped>
.map-popup-title::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(91, 205, 229, 0.58), rgba(54, 217, 255, 0.12) 64%, transparent);
}
/* 复刻 pursuitDashboard 标题标记：窄型斜切框，左边框加粗形成明确的视觉起点。 */
.map-popup-title__marker {
    border: 1px solid rgba(132, 235, 255, 0.72);
    border-left-width: 3px;
    background: rgba(47, 240, 255, 0.08);
    box-shadow: 0 0 8px rgba(47, 240, 255, 0.35);
    transform: skewX(-10deg);
}
.map-popup-title__track::before,
.map-popup-title__track i {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    height: 2px;
    transform: skewX(-34deg);
    background: rgba(75, 195, 220, 0.48);
}
.map-popup-title__track::before { width: 30px; }
.map-popup-title__track i { right: 36px; width: 10px; opacity: 0.65; }
</style>
