<template>
    <div class="grid gap-4">
        <PanelSection title="预警详情">
            <template #actions>
                <button
                    type="button"
                    class="grid size-7 place-items-center border border-sky-200/15 bg-sky-400/[0.04] text-base text-sky-100/55 transition-colors hover:border-screen-primary/40 hover:bg-screen-primary/10 hover:text-screen-primary active:translate-y-px"
                    aria-label="关闭预警详情"
                    title="关闭"
                    @click="$emit('close')"
                >
                    <RiCloseLine class="size-4" />
                </button>
            </template>
            <div class="overflow-hidden border border-sky-200/10 bg-[#08213a]/45">
                <div class="flex items-start justify-between gap-3 border-b border-sky-200/10 px-3.5 py-3">
                    <div class="min-w-0">
                        <span class="inline-flex border px-1.5 py-0.5 font-mono text-[10px]" :class="levelClass">{{ event.level }}</span>
                        <h3 class="mb-0 mt-2 text-[15px] font-semibold leading-6 text-sky-50/95">{{ event.title }}</h3>
                    </div>
                    <span class="flex flex-none items-center gap-1.5 pt-0.5 text-[11px]" :class="statusClass">
                        <i class="size-1.5 rounded-full bg-current" />{{ event.status }}
                    </span>
                </div>
                <dl class="m-0 divide-y divide-sky-200/[0.07] px-3.5">
                    <div v-for="item in detailRows" :key="item.label" class="grid grid-cols-[68px_minmax(0,1fr)] gap-3 py-2.5 text-xs leading-5">
                        <dt class="text-sky-100/38">{{ item.label }}</dt>
                        <dd class="m-0 break-words text-sky-50/75">{{ item.value }}</dd>
                    </div>
                </dl>
            </div>
        </PanelSection>

        <PanelSection title="预警描述">
            <p class="m-0 border-y border-sky-200/10 bg-sky-950/20 px-3 py-3 text-xs leading-6 text-sky-50/65">{{ event.description }}</p>
        </PanelSection>

        <PanelSection title="处置建议">
            <p class="m-0 border-y border-amber-200/10 bg-amber-300/[0.035] px-3 py-3 text-xs leading-6 text-sky-50/65">{{ event.suggestion }}</p>
        </PanelSection>
    </div>
</template>

<script setup lang="ts">
import { RiCloseLine } from '@remixicon/vue';
import { computed } from 'vue';

import PanelSection from '@/components/screen/PanelSection.vue';
import type { OperationWarningEvent } from '@/config/operation';

const props = defineProps<{ event: OperationWarningEvent }>();
defineEmits<{ close: [] }>();

const detailRows = computed(() => [
    { label: '预警编号', value: props.event.id },
    { label: '预警来源', value: props.event.source },
    { label: '预警地址', value: props.event.location },
    { label: '预警时间', value: props.event.occurredAt },
    { label: '经纬度', value: `${props.event.longitude.toFixed(6)}, ${props.event.latitude.toFixed(6)}` },
]);
const levelClass = computed(() => ({
    'Ⅰ级': 'border-red-300/30 bg-red-400/10 text-red-200',
    'Ⅱ级': 'border-amber-300/30 bg-amber-300/[0.09] text-amber-100',
    'Ⅲ级': 'border-sky-300/25 bg-sky-300/[0.08] text-sky-100',
})[props.event.level]);
const statusClass = computed(() => ({
    待处置: 'text-red-200/80',
    处置中: 'text-amber-100/80',
    已处置: 'text-emerald-200/75',
})[props.event.status]);
</script>
