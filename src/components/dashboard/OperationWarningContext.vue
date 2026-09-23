<template>
    <div class="grid">
        <PanelSection title="相关干系人">
            <template #actions>
                <span class="font-vfonts text-[11px] text-sky-100/40">{{ stakeholders.length }} 人</span>
            </template>
            <ul v-if="stakeholders.length" class="m-0 grid list-none gap-2 p-0">
                <li v-for="person in stakeholders" :key="person.id" class="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2.5 border border-sky-200/10 bg-[#08213a]/50 px-3 py-2.5">
                    <span class="grid size-[34px] place-items-center border border-screen-primary/20 bg-screen-primary/[0.07] text-sm text-screen-primary/75">{{ person.name.slice(0, 1) }}</span>
                    <span class="min-w-0">
                        <strong class="block truncate text-xs font-medium text-sky-50/85">{{ person.name }}<small class="ml-2 font-normal text-sky-100/40">{{ person.role }}</small></strong>
                        <small class="mt-1 block truncate text-[10px] text-sky-100/35">{{ person.organization }}</small>
                    </span>
                    <span class="font-vfonts text-[10px] text-sky-100/45">{{ person.phone }}</span>
                </li>
            </ul>
            <n-empty v-else class="py-10" description="暂无相关干系人" />
        </PanelSection>

        <PanelSection title="周边物联网设备">
            <template #actions>
                <span class="font-vfonts text-[11px] text-sky-100/40">{{ nearbyDevices.length }} 台</span>
            </template>

            <fieldset class="mb-3">
                <legend class="sr-only">设备搜索半径</legend>
                <div class="grid grid-cols-4 border border-sky-200/10 bg-[#061a2d]/65 p-1" role="radiogroup" aria-label="设备搜索半径">
                    <label v-for="option in radiusOptions" :key="option" class="group relative cursor-pointer">
                        <input v-model="radius" class="peer sr-only" type="radio" name="device-search-radius" :value="option" />
                        <span class="relative flex h-9 items-center justify-center font-vfonts text-xs text-sky-100/40 transition-[color,background-color,transform] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-screen-primary after:shadow-[0_0_8px_rgba(54,217,255,0.55)] after:transition-transform hover:bg-sky-800/20 hover:text-sky-50/75 active:translate-y-px peer-checked:bg-screen-primary/[0.08] peer-checked:text-screen-primary peer-checked:after:scale-x-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-screen-primary/70">
                            {{ option }}m
                        </span>
                    </label>
                </div>
            </fieldset>

            <ul v-if="nearbyDevices.length" class="m-0 grid list-none gap-2 p-0">
                <li v-for="device in nearbyDevices" :key="device.id" class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-sky-200/10 bg-[#08213a]/50 px-3 py-2.5">
                    <span class="min-w-0">
                        <strong class="block truncate text-xs font-medium text-sky-50/85">{{ device.name }}</strong>
                        <small class="mt-1 flex items-center gap-2 text-[10px] text-sky-100/35">
                            <span>{{ device.type }}</span><span class="font-vfonts">{{ device.id }}</span>
                        </small>
                    </span>
                    <span class="grid justify-items-end gap-1">
                        <small class="font-vfonts text-[10px] text-screen-primary/65">{{ device.distance }}m</small>
                        <small class="flex items-center gap-1 text-[10px]" :class="device.status === '在线' ? 'text-emerald-200/70' : 'text-slate-400/60'">
                            <i class="size-1.5 rounded-full bg-current" />{{ device.status }}
                        </small>
                    </span>
                </li>
            </ul>
            <n-empty v-else class="py-10" description="当前范围内暂无物联网设备" />
        </PanelSection>
    </div>
</template>

<script setup lang="ts">
import { distance, point } from '@turf/turf';
import { computed } from 'vue';

import PanelSection from '@/components/screen/PanelSection.vue';
import {
    warningIoTDevices,
    warningStakeholders,
    type OperationWarningEvent,
} from '@/config/operation';

const props = defineProps<{ event: OperationWarningEvent }>();
const radius = defineModel<number>('radius', { required: true });
const radiusOptions = [100, 300, 500, 1000] as const;
const stakeholders = warningStakeholders;

const nearbyDevices = computed(() => {
    const center = point([props.event.longitude, props.event.latitude]);
    return warningIoTDevices
        .map((device) => ({
            ...device,
            distance: Math.round(distance(center, point([device.longitude, device.latitude]), { units: 'meters' })),
        }))
        .filter((device) => device.distance <= radius.value)
        .sort((left, right) => left.distance - right.distance);
});
</script>
