<template>
    <section class="panel-section">
        <header class="relative mb-[13px] flex min-h-[34px] items-start justify-between gap-[14px] pb-2.5 pl-0 pr-[3px] pt-px">
            <div class="flex min-w-0 items-center gap-[9px]">
                <span class="heading-index relative block h-[19px] w-[13px] flex-none" aria-hidden="true">
                    <i class="absolute -right-px bottom-0 h-[3px] w-[3px] rotate-45 bg-[#83e8f8] shadow-[0_0_5px_rgba(54,217,255,0.4)]" />
                </span>
                <h2 class="m-0 text-[15px] font-semibold leading-[18px] tracking-[0.07em] text-[rgba(241,251,255,0.97)] [text-shadow:0_1px_7px_rgba(9,73,111,0.24)]">{{ title }}</h2>
            </div>
            <div v-if="$slots.actions" class="relative z-[2] flex min-w-0 flex-none items-center justify-end">
                <slot name="actions" />
            </div>
            <div class="heading-track absolute inset-x-0 bottom-0 h-[5px]" aria-hidden="true">
                <i class="heading-track__lead absolute left-0 top-0 h-0.5 w-[66px]" />
                <i class="absolute left-[71px] -top-px h-[5px] w-[5px] rotate-45 border border-[rgba(98,196,226,0.6)] bg-[#061a32]" />
                <i class="absolute right-px top-0 h-[3px] w-[18px] -skew-x-[32deg] border-r border-t border-[rgba(61,146,187,0.45)]" />
            </div>
        </header>
        <div class="min-w-0"><slot /></div>
    </section>
</template>
<script setup lang="ts">
defineProps<{ title: string }>();
</script>
<style scoped>
.panel-section + .panel-section {
    margin-top: 28px;
}
/* 与弹框标题同源的斜切语言，但使用前后双切片和短光点形成模块级识别。 */
.heading-index::before,
.heading-index::after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    transform: skewX(-12deg);
}
.heading-index::before {
    left: 0;
    top: 1px;
    width: 6px;
    height: 17px;
    border: 1px solid rgba(132, 235, 255, 0.74);
    border-left-width: 3px;
    background: rgba(47, 240, 255, 0.09);
    box-shadow: 0 0 7px rgba(47, 240, 255, 0.28);
}
.heading-index::after {
    left: 8px;
    top: 4px;
    width: 4px;
    height: 11px;
    border: 1px solid rgba(80, 177, 211, 0.48);
    background: rgba(31, 120, 157, 0.16);
}
.heading-track::before {
    content: '';
    position: absolute;
    right: 0;
    top: 1px;
    left: 0;
    height: 1px;
    background: linear-gradient(
        90deg,
        rgba(70, 166, 207, 0.58),
        rgba(38, 111, 157, 0.25) 67%,
        rgba(19, 61, 101, 0)
    );
}
.heading-track__lead {
    background: linear-gradient(90deg, #64cfe8, rgba(68, 166, 207, 0.24));
    box-shadow: 0 0 5px rgba(54, 217, 255, 0.13);
}
</style>
