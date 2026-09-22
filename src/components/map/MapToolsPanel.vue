<template>
    <div class="w-[340px] px-3.5 pb-4 pt-3 text-[#eaf8ff]">
        <MapPopupTitle title="地图工具" />
        <div class="mt-3.5 grid grid-cols-3 border-l border-t border-[rgba(91,183,215,0.18)]">
            <button
                v-for="item in tools"
                :key="item.id"
                type="button"
                class="flex min-h-[70px] cursor-pointer flex-col items-center justify-center gap-1.5 border-0 border-b border-r border-[rgba(91,183,215,0.18)] bg-[rgba(8,33,58,0.3)] text-xs text-[rgba(225,244,251,0.68)] transition duration-150 ease-in-out hover:bg-[rgba(54,217,255,0.1)] hover:text-[#7ceaff] [&>svg]:size-[21px]"
                @click="useTool(item)"
            >
                <component :is="item.icon" /><span>{{ item.name }}</span>
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    RiMapPinLine,
    RiCheckboxBlankLine,
    RiCircleLine,
    RiRuler2Line,
    RiShape2Line,
    RiShapeLine,
    RiDeleteBin6Line,
} from '@remixicon/vue';
import type { Component } from 'vue';
import MapPopupTitle from '@/components/map/MapPopupTitle.vue';
import emitter from '@/utils/emitter';
interface ToolOption {
    id: string;
    name: string;
    icon: Component;
}
const tools: ToolOption[] = [
    { id: 'distance', name: '距离测量', icon: RiRuler2Line },
    { id: 'area', name: '面积测量', icon: RiShape2Line },
    { id: 'draw-point', name: '绘制点', icon: RiMapPinLine },
    { id: 'draw-line', name: '绘制线', icon: RiShapeLine },
    { id: 'draw-polygon', name: '绘制面', icon: RiShape2Line },
    { id: 'draw-rectangle', name: '绘制矩形', icon: RiCheckboxBlankLine },
    { id: 'draw-circle', name: '绘制圆', icon: RiCircleLine },
    { id: 'clear', name: '清除绘制', icon: RiDeleteBin6Line },
];
// 这里只定义统一命令；Mapbox 测量和绘制实现可由后续定制模块按 id 监听接入。
const useTool = (item: ToolOption) => emitter.emit('map-tool:command', { id: item.id });
</script>

