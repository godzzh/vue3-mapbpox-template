<template>
    <section class="map-stage" aria-label="城市地图">
        <div id="map-container" ref="containerRef" class="map-container" />
        <div v-if="state !== 'ready'" class="map-state">
            <template v-if="state === 'loading'">
                <div class="skeleton-line skeleton-line--wide" />
                <div class="skeleton-line" />
                <span>正在加载地图配置与底图资源</span>
            </template>
            <template v-else-if="state === 'error'">
                <strong>地图加载失败</strong>
                <span>{{ errorMessage }}</span>
                <button type="button" @click="initializeMap">重新加载</button>
            </template>
            <template v-else>
                <strong>底图配置不可用</strong>
                <span>已启用本地深色背景，请检查 MapConfig 配置。</span>
            </template>
        </div>
    </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useUserStore } from '@/stores/user';
import emitter from '@/utils/emitter';

const props = defineProps<{
    activeLayers: string[];
    managedLayerIds: string[];
    resourceLayerIds: string[];
    activeResourceLayerIds: string[];
}>();
const userStore = useUserStore();
const containerRef = ref<HTMLElement | null>(null);
const state = ref<'loading' | 'ready' | 'error' | 'fallback'>('loading');
const errorMessage = ref('请检查 MapConfig 接口和底图服务。');
let map: MapboxMapInstance | null = null;
let resizeObserver: ResizeObserver | null = null;

const fallbackStyle: Record<string, unknown> = {
    version: 8,
    sources: {},
    layers: [
        { id: 'background', type: 'background', paint: { 'background-color': '#071727' } },
    ],
};

const syncLayerVisibility = () => {
    if (!map) return;
    const visibleLayerIds = new Set(props.activeLayers);
    props.managedLayerIds.forEach((layerId) => {
        // 底图配置可能按项目裁剪图层；不存在的图层安全跳过。
        if (map?.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', visibleLayerIds.has(layerId) ? 'visible' : 'none');
    });
};

const syncResourceLayerVisibility = () => {
    if (!map) return;
    const visibleLayerIds = new Set(props.activeResourceLayerIds);
    props.resourceLayerIds.forEach((layerId) => {
        if (map?.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', visibleLayerIds.has(layerId) ? 'visible' : 'none');
    });
};

const fetchStyle = async (styleUrl: string): Promise<MapboxStyle> => {
    if (!styleUrl) return fallbackStyle;
    const response = await fetch(styleUrl);
    if (!response.ok) throw new Error(`底图样式请求失败 (${response.status})`);
    return (await response.json()) as Record<string, unknown>;
};

const initializeMap = async () => {
    if (!containerRef.value) return;
    map?.remove();
    map = null;
    state.value = 'loading';

    if (typeof window.mapboxgl?.Map !== 'function') {
        state.value = 'error';
        errorMessage.value = '全局 mapboxgl 未加载，请检查 index.html 中的固定版本脚本。';
        return;
    }

    try {
        if (!userStore.mapConfigLoaded) await userStore.getMapConfig();
        const styleUrl = userStore.darkBlueStyle || userStore.lightBlueStyle;
        const style = await fetchStyle(styleUrl);
        const configuredOptions = userStore.mapOptions;
        const options: MapboxMapOptions = {
            attributionControl: false,
            crs: configuredOptions.crs || 'EPSG:3857',
            ...configuredOptions,
            container: containerRef.value,
            style,
        };

        map = new window.mapboxgl.Map(options);
        window.mapViewer = map;
        map.once('styledata', () => {
            syncLayerVisibility();
            syncResourceLayerVisibility();
            state.value = styleUrl ? 'ready' : 'fallback';
            emitter.emit('map:ready', undefined);
        });
        map.on('error', (event) => {
            if (event.error?.message) {
                errorMessage.value = event.error.message;
                state.value = 'error';
            }
        });
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '地图初始化失败。';
        state.value = 'error';
    }
};

watch([() => props.managedLayerIds, () => props.activeLayers], syncLayerVisibility, { deep: true });
watch(
    [() => props.resourceLayerIds, () => props.activeResourceLayerIds],
    syncResourceLayerVisibility,
    { deep: true },
);

onMounted(async () => {
    await nextTick();
    await initializeMap();
    if (containerRef.value) {
        resizeObserver = new ResizeObserver(() => map?.resize());
        resizeObserver.observe(containerRef.value);
    }
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    map?.remove();
    map = null;
    delete window.mapViewer;
});
</script>

<style scoped lang="less">
.map-stage,.map-container { position: absolute; inset: 0; }
.map-stage { background: radial-gradient(circle at 52% 44%, #123d57 0, #071827 38%, #030b14 100%); }
.map-state { position: absolute; left: 50%; top: 48%; z-index: 3; transform: translate(-50%,-50%); width: min(340px, calc(100% - 48px)); padding: 18px 22px; text-align: center; display: grid; gap: 8px; color: var(--muted); background: rgba(3,17,30,.72); border: 1px solid rgba(54,217,255,.2); backdrop-filter: blur(10px); }
.map-state strong { color: #e9faff; } .map-state button { justify-self: center; margin-top: 6px; padding: 7px 18px; border: 1px solid var(--accent); color: #dffaff; background: var(--accent-soft); cursor: pointer; }
.skeleton-line { height: 7px; width: 62%; margin: auto; background: linear-gradient(90deg, rgba(54,217,255,.06), rgba(54,217,255,.34), rgba(54,217,255,.06)); background-size: 200% 100%; animation: shimmer 1.4s infinite; } .skeleton-line--wide { width: 85%; }
@keyframes shimmer { to { background-position: -200% 0; } }
:deep(.mapboxgl-ctrl-bottom-right) { bottom: 96px; right: 22px; } :deep(.mapboxgl-ctrl-group) { background: rgba(4,20,36,.85); border: 1px solid var(--panel-border); } :deep(.mapboxgl-ctrl button .mapboxgl-ctrl-icon) { filter: invert(1) brightness(1.8); }
</style>
