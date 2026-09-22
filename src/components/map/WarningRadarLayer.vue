<template>
    <span class="hidden" aria-hidden="true" />
</template>

<script setup lang="ts">
import { PointLayer, Scene, type ILayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import { circle, distance, featureCollection, point } from '@turf/turf';
import { onBeforeUnmount, onMounted, watch } from 'vue';

import { warningIoTDevices, type OperationWarningEvent } from '@/config/operation';
import emitter from '@/utils/emitter';

const props = defineProps<{ event: OperationWarningEvent; radius: number }>();

const sourceIds = {
    radius: 'operation-warning-radius-source',
    devices: 'operation-warning-devices-source',
};
const layerIds = {
    radiusFill: 'operation-warning-radius-fill',
    radiusLine: 'operation-warning-radius-line',
    devices: 'operation-warning-devices',
};
let scene: Scene | null = null;
let radarLayer: ILayer | null = null;
let map: MapboxMapInstance | null = null;
let zoomHandler: MapboxEventHandler | null = null;

const getRadarSize = () => {
    if (!map) return 80;
    const latitude = map.getCenter().lat;
    const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / 2 ** map.getZoom();
    return (props.radius * 2) / metersPerPixel;
};

const updateNativeLayers = () => {
    if (!map) return;
    const radiusFeature = circle(
        [props.event.longitude, props.event.latitude],
        props.radius / 1000,
        { steps: 100, units: 'kilometers' },
    );
    map.getSource(sourceIds.radius)?.setData(radiusFeature);

    const center = point([props.event.longitude, props.event.latitude]);
    const nearbyFeatures = warningIoTDevices
        .map((device) => {
            const devicePoint = point([device.longitude, device.latitude], device);
            return { devicePoint, distance: Math.round(distance(center, devicePoint, { units: 'meters' })) };
        })
        .filter((item) => item.distance <= props.radius)
        .map((item) => item.devicePoint);
    map.getSource(sourceIds.devices)?.setData(featureCollection(nearbyFeatures));
};

const updateRadarLayer = () => {
    if (!scene) return;
    if (radarLayer) scene.removeLayer(radarLayer);
    radarLayer = new PointLayer({ name: '预警雷达扫描圈' })
        .source([{ lng: props.event.longitude, lat: props.event.latitude }], {
            parser: { type: 'json', x: 'lng', y: 'lat' },
        })
        .shape('radar')
        .size(getRadarSize())
        .color('rgba(60, 255, 255, 0.45)')
        .style({ speed: 4 })
        .active(false)
        .animate(true);
    scene.addLayer(radarLayer as ILayer);
};

const addNativeLayers = () => {
    if (!map) return;
    if (!map.getSource(sourceIds.radius)) {
        map.addSource(sourceIds.radius, { type: 'geojson', data: featureCollection([]) });
    }
    if (!map.getLayer(layerIds.radiusFill)) {
        map.addLayer({
            id: layerIds.radiusFill,
            type: 'fill',
            source: sourceIds.radius,
            paint: { 'fill-color': '#3cffff', 'fill-opacity': 0.08 },
        });
    }
    if (!map.getLayer(layerIds.radiusLine)) {
        map.addLayer({
            id: layerIds.radiusLine,
            type: 'line',
            source: sourceIds.radius,
            paint: { 'line-color': '#3cffff', 'line-width': 1.2, 'line-opacity': 0.72 },
        });
    }
    if (!map.getSource(sourceIds.devices)) {
        map.addSource(sourceIds.devices, { type: 'geojson', data: featureCollection([]) });
    }
    if (!map.getLayer(layerIds.devices)) {
        map.addLayer({
            id: layerIds.devices,
            type: 'circle',
            source: sourceIds.devices,
            paint: {
                'circle-radius': 5,
                'circle-color': '#62f5b5',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#08213a',
            },
        });
    }
};

const initialize = () => {
    if (scene || !window.mapViewer) return;
    // 定制增强版 Mapbox 在底图可操作后，isStyleLoaded() 仍可能返回 false；
    // 这里以 MapView 派发的 map:ready 和全局实例存在性作为初始化边界。
    map = window.mapViewer;
    addNativeLayers();
    updateNativeLayers();
    map.flyTo({ center: [props.event.longitude, props.event.latitude], zoom: Math.max(map.getZoom(), 15), duration: 900 });

    scene = new Scene({
        id: 'map-container',
        map: new Mapbox({ mapInstance: map as never }),
        logoVisible: false,
    });
    scene.on('loaded', updateRadarLayer);
    zoomHandler = () => radarLayer?.size(getRadarSize());
    map.on('zoom', zoomHandler);
};

const cleanup = () => {
    if (map && zoomHandler) map.off('zoom', zoomHandler);
    if (scene && radarLayer) scene.removeLayer(radarLayer);
    radarLayer = null;
    // L7 的 Mapbox 适配器接管的是既有 mapInstance，调用 scene.destroy() 会连带移除主地图。
    // 这里只移除业务图层，保留场景容器供本次路由生命周期内复用。
    if (map) {
        [layerIds.devices, layerIds.radiusLine, layerIds.radiusFill].forEach((id) => {
            if (map?.getLayer(id)) map.removeLayer(id);
        });
        [sourceIds.devices, sourceIds.radius].forEach((id) => {
            if (map?.getSource(id)) map.removeSource(id);
        });
    }
    map = null;
    zoomHandler = null;
};

watch(
    () => [props.event.id, props.radius] as const,
    () => {
        if (!scene) {
            initialize();
            return;
        }
        updateNativeLayers();
        updateRadarLayer();
        map?.flyTo({ center: [props.event.longitude, props.event.latitude], duration: 700 });
    },
);

onMounted(() => {
    emitter.on('map:ready', initialize);
    initialize();
});
onBeforeUnmount(() => {
    emitter.off('map:ready', initialize);
    cleanup();
});
</script>
