<template>
    <div class="grid gap-4">
        <section class="border-y border-sky-200/10 bg-sky-950/20" aria-label="预警时间筛选">
            <n-date-picker
                :value="dateRange"
                class="w-full"
                type="datetimerange"
                clearable
                :is-date-disabled="disableFutureDate"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm"
                :shortcuts="dateRangeShortcuts"
                @update:value="handleDateRangeUpdate"
            />
        </section>

        <PanelSection title="预警事件">
            <template #actions>
                <span class="font-mono text-[11px] text-sky-100/40">共 {{ filteredEvents.length }} 条</span>
            </template>

            <div class="mb-3">
                <n-input-group class="w-full">
                    <n-input v-model:value="keyword" clearable placeholder="搜索事件或位置">
                        <template #prefix><RiSearchLine class="size-4 text-screen-primary/60" /></template>
                    </n-input>
                    <n-select v-model:value="status" :options="statusOptions" class="w-[150px]" />
                </n-input-group>
            </div>

            <ul v-if="filteredEvents.length" class="m-0 grid list-none gap-2.5 p-0" aria-label="预警事件列表">
                <li
                    v-for="event in filteredEvents"
                    :key="event.id"
                    tabindex="0"
                    role="button"
                    class="group relative min-h-[84px] cursor-pointer overflow-hidden border border-sky-200/[0.09] bg-[#08213a]/55 px-3 py-2.5 transition-[border-color,background-color,transform] hover:-translate-y-px hover:border-sky-200/25 hover:bg-[#0a2947]/72 focus-visible:border-screen-primary/60 focus-visible:outline-none"
                    @click="$emit('select', event)"
                    @keyup.enter="$emit('select', event)"
                >
                    <div class="min-w-0">
                        <div class="flex items-start justify-between gap-2.5">
                            <div class="flex min-w-0 items-center gap-2">
                                <span class="flex-none border px-1.5 py-0.5 font-mono text-[10px] font-medium leading-4" :class="levelStyles[event.level].tag">{{ event.level }}</span>
                                <strong class="min-w-0 truncate text-[13px] font-medium leading-5 text-sky-50/90">{{ event.title }}</strong>
                            </div>
                            <span class="flex flex-none items-center gap-1.5 whitespace-nowrap pt-0.5 text-[10px]" :class="statusStyles[event.status]">
                                <i class="size-1.5 rounded-full bg-current" aria-hidden="true" />
                                {{ event.status }}
                            </span>
                        </div>
                        <span class="mt-0.5 block truncate text-[11px] leading-5 text-sky-100/45">{{ event.location }}</span>
                        <div class="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-sky-200/[0.07] pt-1.5 font-mono text-[10px]">
                            <span class="truncate tracking-[0.03em] text-sky-100/28">{{ event.id }}</span>
                            <time class="whitespace-nowrap text-sky-100/40">{{ formatEventTime(event.occurredAt) }}</time>
                        </div>
                    </div>

                    <i
                        class="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        :class="levelStyles[event.level].rail"
                        aria-hidden="true"
                    />
                </li>
            </ul>

            <n-empty v-else class="py-12" description="当前条件下暂无预警事件" />
        </PanelSection>
    </div>
</template>

<script setup lang="ts">
import { RiSearchLine } from '@remixicon/vue';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';

import PanelSection from '@/components/screen/PanelSection.vue';
import {
    operationWarningEvents,
    type OperationWarningEvent,
    type WarningEventLevel,
    type WarningEventStatus,
} from '@/config/operation';
import { dateRangeShortcuts } from '@/utils/options';

defineEmits<{ select: [event: OperationWarningEvent] }>();

const statusOptions = [
    { label: '全部状态', value: '全部' },
    { label: '待处置', value: '待处置' },
    { label: '处置中', value: '处置中' },
    { label: '已处置', value: '已处置' },
];
const levelStyles: Record<WarningEventLevel, { tag: string; rail: string }> = {
    'Ⅰ级': {
        tag: 'border-red-300/30 bg-red-400/[0.1] text-red-200',
        rail: 'bg-gradient-to-r from-red-400/80 via-red-300/30 to-transparent',
    },
    'Ⅱ级': {
        tag: 'border-amber-300/30 bg-amber-300/[0.09] text-amber-100',
        rail: 'bg-gradient-to-r from-amber-300/80 via-amber-200/30 to-transparent',
    },
    'Ⅲ级': {
        tag: 'border-sky-300/25 bg-sky-300/[0.08] text-sky-100',
        rail: 'bg-gradient-to-r from-sky-300/75 via-sky-200/25 to-transparent',
    },
};
const statusStyles: Record<WarningEventStatus, string> = {
    待处置: 'text-red-200/80',
    处置中: 'text-amber-100/80',
    已处置: 'text-emerald-200/75',
};

const keyword = ref('');
const status = ref<'全部' | WarningEventStatus>('全部');
const dateRange = ref<[number, number] | null>(null);

const handleDateRangeUpdate = (value: [number, number] | null) => {
    dateRange.value = value;
};

const disableFutureDate = (timestamp: number) => timestamp > dayjs().endOf('day').valueOf();
const formatEventTime = (value: string) => dayjs(value).format('MM-DD HH:mm');

const filteredEvents = computed(() => {
    const normalizedKeyword = keyword.value.trim().toLowerCase();
    return operationWarningEvents.filter((event) => {
        const occurredAt = dayjs(event.occurredAt).valueOf();
        const matchesDate = !dateRange.value || (occurredAt >= dateRange.value[0] && occurredAt <= dateRange.value[1]);
        const matchesStatus = status.value === '全部' || event.status === status.value;
        const matchesKeyword = !normalizedKeyword || `${event.title}${event.location}`.toLowerCase().includes(normalizedKeyword);
        return matchesDate && matchesStatus && matchesKeyword;
    });
});
</script>
