<template>
    <div class="min-h-[268px] w-[360px] px-4 pb-4 pt-3 text-[#eaf8ff]">
        <MapPopupTitle title="资源搜索" />
        <div class="mt-[15px] grid grid-cols-[1fr_auto] gap-2">
            <n-input
                v-model:value="keyword"
                clearable
                placeholder="请输入资源名称或关键字"
                @keyup.enter="submitSearch"
                :allow-input="noSideSpace"
            />
            <n-button type="primary" @click="submitSearch"
                ><template #icon><RiSearchLine /></template>搜索</n-button
            >
        </div>
        <div class="mt-3 flex flex-wrap gap-[7px]" role="group" aria-label="资源类型">
            <button
                v-for="item in resourceTypes"
                :key="item.id"
                type="button"
                class="h-7 cursor-pointer border border-[rgba(123,203,228,0.18)] bg-[rgba(13,48,76,0.48)] px-[11px] text-xs text-[rgba(225,244,251,0.62)] hover:border-[rgba(54,217,255,0.62)] hover:bg-[rgba(54,217,255,0.12)] hover:text-[#dffaff]"
                :class="activeType === item.id ? 'border-[rgba(54,217,255,0.62)] bg-[rgba(54,217,255,0.12)] text-[#dffaff]' : ''"
                @click="activeType = item.id"
            >
                {{ item.name }}
            </button>
        </div>
        <div class="mt-5 grid justify-items-center gap-[7px] border border-dashed border-[rgba(91,183,215,0.2)] px-3.5 py-[17px] text-center text-[rgba(210,238,248,0.42)]">
            <RiSearchEyeLine class="size-[26px] text-[rgba(54,217,255,0.48)]" /><strong
                class="text-xs font-medium text-[rgba(230,247,253,0.64)]"
                >输入关键字搜索地图资源</strong
            ><span class="max-w-[290px] text-xs leading-[1.6]"
                >后续可在此接入楼栋、视频、警力设备、AOI 和 POI 等资源接口</span
            >
        </div>
    </div>
</template>
<script setup lang="ts">
import { noSideSpace } from "@/utils/options";
import { RiSearchEyeLine, RiSearchLine } from '@remixicon/vue';
import { ref } from 'vue';
import MapPopupTitle from '@/components/map/MapPopupTitle.vue';
import emitter from '@/utils/emitter';
const keyword = ref('');
const activeType = ref('all');
const resourceTypes = [
    { id: 'all', name: '全部' },
    { id: 'building', name: '楼栋' },
    { id: 'video', name: '视频' },
    { id: 'police', name: '警力设备' },
    { id: 'poi', name: 'POI' },
] as const;
const submitSearch = () => {
    const value = keyword.value.trim();
    if (!value) {
        window.$message?.warning('请输入搜索关键字');
        return;
    }
    emitter.emit('map-tool:resource-search', { keyword: value, type: activeType.value });
};
</script>

