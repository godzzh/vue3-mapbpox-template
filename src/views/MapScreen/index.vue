<template>
    <main class="relative min-h-[100dvh] w-full overflow-hidden bg-screen-bg">
        <MapView
            :active-layers="activeLayerIds"
            :managed-layer-ids="managedLayerIds"
            :resource-layer-ids="resourceLayerIds"
            :active-resource-layer-ids="store.visibleResourceLayerIds"
        />
        <MapCompass />
        <MapMeasureControl />
        <ScreenHeader :title="platformTitle" />

        <RouterView />

        <MapToolMenu
            :active-tool="activeTool"
            :functions="userStore.visibleAppFunctions"
            @select="handleToolSelect"
            @clear="handleClear"
        />
        <MapToolPanel :tool="activeContentTool" @close="activeTool = null" />
        <ResourceLayerPanel
            v-model:visible="resourceLayerPanelVisible"
            :groups="userStore.resourceLayerTree"
            :active-layer-ids="store.visibleResourceLayerIds"
            @toggle="handleResourceLayerToggle"
        />
        <LayerControl v-model:visible="store.layerPanelVisible" :layers="store.layers" @toggle="store.toggleLayer" @reset="store.resetLayers" />
        <BottomMenu :active-id="activeMenuId" :items="screenMenus" />
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { appConfig } from '@/config';
import LayerControl from '@/components/map/LayerControl.vue';
import MapCompass from '@/components/map/MapCompass.vue';
import MapMeasureControl from '@/components/map/MapMeasureControl.vue';
import ResourceLayerPanel from '@/components/map/ResourceLayerPanel.vue';
import MapToolMenu, { type MapToolId } from '@/components/map/MapToolMenu.vue';
import MapToolPanel from '@/components/map/MapToolPanel.vue';
import MapView from '@/components/map/MapView.vue';
import BottomMenu from '@/components/screen/BottomMenu.vue';
import ScreenHeader from '@/components/screen/ScreenHeader.vue';
import { screenMenus } from '@/config/screen';
import { useScreenStore } from '@/stores/screen';
import { useUserStore } from '@/stores/user';
import emitter from '@/utils/emitter';

const route = useRoute();
const store = useScreenStore();
const userStore = useUserStore();
const platformTitle = appConfig.platform.title;
const activeLayerIds = computed(() => store.layers.filter((item) => item.visible).flatMap((item) => item.layerIds));
const managedLayerIds = computed(() => store.layers.flatMap((item) => item.layerIds));
const resourceLayerIds = computed(() =>
    userStore.resourceLayerTree.flatMap((group) =>
        group.children.flatMap((layer) => (layer.metadata ? [layer.metadata.layerId] : [])),
    ),
);
const activeMenuId = computed(() => (typeof route.meta.menuId === 'string' ? route.meta.menuId : 'home'));
const activeTool = ref<MapToolId | null>(null);
const resourceLayerPanelVisible = ref(false);
const activeContentTool = computed<'search' | 'tools' | null>(() =>
    activeTool.value === 'search' || activeTool.value === 'tools' ? activeTool.value : null,
);

watch(
    () => userStore.layerControlOptions,
    (options) => {
        store.setLayerOptions(options);
    },
    { immediate: true },
);

// 弹框也可通过自身关闭按钮关闭，菜单激活态必须同步复位。
watch(resourceLayerPanelVisible, (visible) => {
    if (!visible && activeTool.value === 'resource-layers') activeTool.value = null;
});

watch(
    () => store.layerPanelVisible,
    (visible) => {
        if (!visible && activeTool.value === 'layers') activeTool.value = null;
    },
);

const handleToolSelect = (tool: MapToolId | null) => {
    activeTool.value = tool;
    resourceLayerPanelVisible.value = tool === 'resource-layers';
    store.layerPanelVisible = tool === 'layers';
    if (tool === 'search') emitter.emit('map-tool:search', undefined);
    if (tool === 'tools') emitter.emit('map-tool:tools', undefined);
};

const handleResourceLayerToggle = (layerId: string) => {
    if (!layerId) {
        window.$message?.warning('该资源图层未配置有效的图层 ID');
        return;
    }
    store.toggleResourceLayer(layerId);
};

const handleClear = () => {
    activeTool.value = null;
    resourceLayerPanelVisible.value = false;
    store.layerPanelVisible = false;
    store.clearResourceLayers();
    store.resetLayers();
    emitter.emit('map-tool:clear', undefined);
    window.$message?.success('地图临时内容已清除');
};
</script>


