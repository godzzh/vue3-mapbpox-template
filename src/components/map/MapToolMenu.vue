<template>
    <nav class="fixed right-8 top-[110px] z-[1110] max-[1024px]:right-2 max-[1024px]:top-24 max-[1024px]:origin-top-right max-[1024px]:scale-[0.88]" aria-label="地图快捷工具">
        <button
            v-for="item in visibleItems"
            :key="item.id"
            type="button"
            class="mb-4 block w-[60px] cursor-pointer select-none border-0 bg-transparent p-0 text-xs text-white/50 transition-[filter,color] duration-200 ease-in-out last:mb-0 hover:text-white hover:sepia focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(110,221,243,0.8)]"
            :class="activeTool === item.id ? 'text-white sepia' : ''"
            :aria-pressed="activeTool === item.id"
            @click="selectTool(item.id)"
        >
            <span class="flex size-[60px] items-center justify-center bg-[url('/static/images/map-tools/bg_01.png')] bg-[length:100%_100%] bg-center bg-no-repeat"><img class="size-5 object-contain" :src="item.icon" alt="" /></span>
            <span class="block text-center transition-colors duration-200">{{ item.name }}</span>
        </button>
    </nav>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { AppFunction } from '@/services/function';

export type MapToolId='search'|'resource-layers'|'layers'|'tools'|'clear';
export interface MapToolItem { id:MapToolId; name:string; icon:string; }
const props=defineProps<{activeTool:MapToolId|null;functions:AppFunction[]}>();
const emit=defineEmits<{select:[id:MapToolId|null];clear:[]}>();
// 接口当前未配置 functionUrl/functionIcon，本地注册表只负责交互实现，不参与权限判断。
const toolRegistry:Record<string,Omit<MapToolItem,'name'>>={
    '资源搜索':{id:'search',icon:'/static/images/map-tools/icon_101.png'},
    '资源图层':{id:'resource-layers',icon:'/static/images/map-tools/icon_102.png'},
    '图层控制':{id:'layers',icon:'/static/images/map-tools/icon_102.png'},
    '地图工具':{id:'tools',icon:'/static/images/map-tools/icon_103.png'},
    '一键清除':{id:'clear',icon:'/static/images/map-tools/icon_105.png'},
};
const visibleItems=computed(()=>props.functions
    .filter((item)=>item.functionLevel===1&&!item.parentHierarchyCode)
    .sort((left,right)=>left.orderHierarchyCode.localeCompare(right.orderHierarchyCode))
    .flatMap((item)=>{
        const tool=toolRegistry[item.functionName];
        return tool?[{...tool,name:item.functionName}]:[];
    }));
// 清除是一次性命令，其余菜单是可切换的工具面板入口。
const selectTool=(id:MapToolId)=>{if(id==='clear'){emit('clear');return}emit('select',props.activeTool===id?null:id)};
</script>

