<template>
    <SidePanel v-model:expanded="screenStore.leftExpanded" side="left">
        <OperationWarningQuery v-if="!selectedEvent" @select="handleSelect" />
        <OperationWarningDetail v-else :event="selectedEvent" @close="handleClose" />
    </SidePanel>

    <SidePanel v-if="selectedEvent" v-model:expanded="screenStore.rightExpanded" side="right">
        <OperationWarningContext v-model:radius="radius" :event="selectedEvent" />
    </SidePanel>

    <WarningRadarLayer v-if="selectedEvent" :event="selectedEvent" :radius="radius" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import OperationWarningContext from '@/components/dashboard/OperationWarningContext.vue';
import OperationWarningDetail from '@/components/dashboard/OperationWarningDetail.vue';
import OperationWarningQuery from '@/components/dashboard/OperationWarningQuery.vue';
import SidePanel from '@/components/screen/SidePanel.vue';
import type { OperationWarningEvent } from '@/config/operation';
import { useScreenStore } from '@/stores/screen';

// L7 会引入自身的 Mapbox 适配代码，只在进入详情时异步加载，避免列表页刷新干扰主地图初始化。
const WarningRadarLayer = defineAsyncComponent(() => import('@/components/map/WarningRadarLayer.vue'));
const screenStore = useScreenStore();
const selectedEvent = ref<OperationWarningEvent | null>(null);
const radius = ref(300);

const handleSelect = (event: OperationWarningEvent) => {
    selectedEvent.value = event;
    radius.value = 300;
    screenStore.leftExpanded = true;
    screenStore.rightExpanded = true;
};

const handleClose = () => {
    selectedEvent.value = null;
    radius.value = 300;
};
</script>
