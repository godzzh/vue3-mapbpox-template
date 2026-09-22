<template>
    <Transition name="measure-status">
        <aside v-if="mode" class="measure-status" role="status" aria-live="polite">
            <span class="measure-status__type">{{ mode === 'distance' ? '距离测量' : '面积测量' }}</span>
            <strong>{{ resultText }}</strong>
            <span>{{ instruction }}</span>
            <button type="button" @click="clearMeasure">清除</button>
        </aside>
    </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import emitter from '@/utils/emitter';

type MeasureMode = 'distance' | 'area';
type CustomDrawMode = 'rectangle' | 'circle';
type Position = [number, number];

const mode = ref<MeasureMode | null>(null);
const resultText = ref('等待绘制');
let map: MapboxMapInstance | null = null;
let draw: MapboxDrawInstance | null = null;
let connectTimer: number | null = null;
let resultMarkers: MapboxMarkerInstance[] = [];
let updateFrame: number | null = null;
let customDrawMode: CustomDrawMode | null = null;
let customDrawStart: Position | null = null;
let previewFeatureId: string | number | null = null;

const instruction = computed(() =>
    mode.value === 'distance' ? '单击添加节点，双击结束测量' : '单击添加边界点，点击起点闭合结束',
);

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const haversineDistance = (start: Position, end: Position) => {
    const earthRadius = 6371008.8;
    const latitudeDelta = toRadians(end[1] - start[1]);
    const longitudeDelta = toRadians(end[0] - start[0]);
    const startLatitude = toRadians(start[1]);
    const endLatitude = toRadians(end[1]);
    const value =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    return 2 * earthRadius * Math.asin(Math.sqrt(value));
};

const calculateDistance = (coordinates: Position[]) =>
    coordinates.slice(1).reduce((total, coordinate, index) => total + haversineDistance(coordinates[index]!, coordinate), 0);

// 将经纬度投影到局部平面后使用鞋带公式，适合当前城市级测量范围。
const calculateArea = (coordinates: Position[]) => {
    if (coordinates.length < 3) return 0;
    const earthRadius = 6371008.8;
    const meanLatitude = toRadians(coordinates.reduce((sum, item) => sum + item[1], 0) / coordinates.length);
    const points = coordinates.map(([longitude, latitude]) => [earthRadius * toRadians(longitude) * Math.cos(meanLatitude), earthRadius * toRadians(latitude)] as Position);
    return Math.abs(points.reduce((sum, point, index) => {
        const next = points[(index + 1) % points.length]!;
        return sum + point[0] * next[1] - next[0] * point[1];
    }, 0) / 2);
};

const formatDistance = (meters: number) => (meters >= 1000 ? `${(meters / 1000).toFixed(2)} 千米` : `${meters.toFixed(1)} 米`);
const formatArea = (squareMeters: number) => (squareMeters >= 1_000_000 ? `${(squareMeters / 1_000_000).toFixed(2)} 平方千米` : `${squareMeters.toFixed(1)} 平方米`);
const geographicMidpoint = (start: Position, end: Position): Position => [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

// 使用屏幕投影计算视觉中点，避免地图倾斜、旋转或自定义 CRS 下标签逐段偏离线段。
const visualMidpoint = (start: Position, end: Position): Position => {
    if (!map) return geographicMidpoint(start, end);
    const startPoint = map.project(start);
    const endPoint = map.project(end);
    const center = map.unproject({ x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 });
    return [center.lng, center.lat];
};

const clearResultMarkers = () => {
    resultMarkers.forEach((marker) => marker.remove());
    resultMarkers = [];
};

const addResultMarker = (coordinates: Position, text: string, variant: 'segment' | 'total' | 'area') => {
    if (!map) return;
    const element = document.createElement('div');
    element.className = `map-measure-label map-measure-label--${variant}`;
    element.textContent = text;
    resultMarkers.push(new window.mapboxgl.Marker({ element, anchor: 'bottom', offset: [0, -8] }).setLngLat(coordinates).addTo(map));
};

const renderDistanceMarkers = (coordinates: Position[]) => {
    coordinates.slice(1).forEach((coordinate, index) => {
        const start = coordinates[index]!;
        addResultMarker(visualMidpoint(start, coordinate), formatDistance(haversineDistance(start, coordinate)), 'segment');
    });
    if (coordinates.length > 1) addResultMarker(coordinates[coordinates.length - 1]!, `总长 ${formatDistance(calculateDistance(coordinates))}`, 'total');
};

const polygonCenter = (coordinates: Position[]): Position => {
    const points = coordinates.length > 1 && coordinates[0]?.[0] === coordinates[coordinates.length - 1]?.[0] && coordinates[0]?.[1] === coordinates[coordinates.length - 1]?.[1] ? coordinates.slice(0, -1) : coordinates;
    if (!points.length) return [0, 0];
    return [points.reduce((sum, item) => sum + item[0], 0) / points.length, points.reduce((sum, item) => sum + item[1], 0) / points.length];
};

const updateResult: MapboxEventHandler = () => {
    const features = draw?.getAll().features ?? [];
    const feature = features[features.length - 1];
    clearResultMarkers();
    if (!feature || !mode.value) return;
    if (mode.value === 'distance' && feature.geometry.type === 'LineString') {
        const coordinates = feature.geometry.coordinates as Position[];
        resultText.value = formatDistance(calculateDistance(coordinates));
        renderDistanceMarkers(coordinates);
    }
    if (mode.value === 'area' && feature.geometry.type === 'Polygon') {
        const ring = (feature.geometry.coordinates as Position[][])[0] ?? [];
        const area = calculateArea(ring);
        resultText.value = formatArea(area);
        if (ring.length >= 3) addResultMarker(polygonCenter(ring), formatArea(area), 'area');
    }
};

const scheduleResultUpdate: MapboxEventHandler = () => {
    if (updateFrame !== null) return;
    updateFrame = window.requestAnimationFrame(() => {
        updateFrame = null;
        updateResult({});
    });
};

const getEventPosition = (event: { [key: string]: unknown }): Position | null => {
    const lngLat = event.lngLat as { lng?: unknown; lat?: unknown } | undefined;
    return typeof lngLat?.lng === 'number' && typeof lngLat.lat === 'number' ? [lngLat.lng, lngLat.lat] : null;
};

const rectangleRing = (start: Position, end: Position): Position[] => [start, [end[0], start[1]], end, [start[0], end[1]], start];

const circleRing = (center: Position, edge: Position): Position[] => {
    const radius = haversineDistance(center, edge);
    const latitude = toRadians(center[1]);
    return Array.from({ length: 65 }, (_, index) => {
        const angle = (index / 64) * Math.PI * 2;
        const latitudeOffset = (radius * Math.sin(angle)) / 6371008.8;
        const longitudeOffset = (radius * Math.cos(angle)) / (6371008.8 * Math.max(Math.cos(latitude), 0.000001));
        return [center[0] + (longitudeOffset * 180) / Math.PI, center[1] + (latitudeOffset * 180) / Math.PI] as Position;
    });
};

const setPreviewPolygon = (ring: Position[]) => {
    if (!draw) return;
    if (previewFeatureId !== null) draw.delete(previewFeatureId);
    const [id] = draw.add({ type: 'Feature', properties: { drawKind: customDrawMode }, geometry: { type: 'Polygon', coordinates: [ring] } });
    previewFeatureId = id ?? null;
};

const stopCustomDraw = (removePreview: boolean) => {
    if (removePreview && previewFeatureId !== null) draw?.delete(previewFeatureId);
    customDrawMode = null;
    customDrawStart = null;
    previewFeatureId = null;
};

const handleCustomDrawClick: MapboxEventHandler = (event) => {
    if (!customDrawMode) return;
    const position = getEventPosition(event);
    if (!position) return;
    if (!customDrawStart) {
        customDrawStart = position;
        return;
    }
    setPreviewPolygon(customDrawMode === 'rectangle' ? rectangleRing(customDrawStart, position) : circleRing(customDrawStart, position));
    stopCustomDraw(false);
    draw?.changeMode('simple_select');
};

const handleCustomDrawMove: MapboxEventHandler = (event) => {
    if (!customDrawMode || !customDrawStart) return;
    const position = getEventPosition(event);
    if (!position) return;
    setPreviewPolygon(customDrawMode === 'rectangle' ? rectangleRing(customDrawStart, position) : circleRing(customDrawStart, position));
};

const connectMap = () => {
    if (draw && map) return true;
    if (!window.mapViewer || !window.MapboxDraw || !window.mapViewer.isStyleLoaded()) return false;
    map = window.mapViewer;
    draw = new window.MapboxDraw({ displayControlsDefault: false, styles: measureStyles });
    map.addControl(draw);
    map.on('draw.create', updateResult);
    map.on('draw.update', updateResult);
    map.on('click', scheduleResultUpdate);
    map.on('mousemove', scheduleResultUpdate);
    map.on('click', handleCustomDrawClick);
    map.on('mousemove', handleCustomDrawMove);
    return true;
};

const clearMeasure = () => {
    stopCustomDraw(false);
    draw?.deleteAll();
    clearResultMarkers();
    draw?.changeMode('simple_select');
    mode.value = null;
    resultText.value = '等待绘制';
};

const startMeasure = (nextMode: MeasureMode) => {
    if (!connectMap() || !draw) {
        window.$message?.error('地图测量组件尚未加载');
        return;
    }
    stopCustomDraw(true);
    draw.deleteAll();
    clearResultMarkers();
    mode.value = nextMode;
    resultText.value = '等待绘制';
    draw.changeMode(nextMode === 'distance' ? 'draw_line_string' : 'draw_polygon');
};

const startStandardDraw = (drawMode: 'draw_point' | 'draw_line_string' | 'draw_polygon') => {
    if (!connectMap() || !draw) {
        window.$message?.error('地图绘制组件尚未加载');
        return;
    }
    stopCustomDraw(true);
    clearResultMarkers();
    mode.value = null;
    resultText.value = '等待绘制';
    draw.changeMode(drawMode);
};

const startCustomDraw = (nextMode: CustomDrawMode) => {
    if (!connectMap() || !draw) {
        window.$message?.error('地图绘制组件尚未加载');
        return;
    }
    stopCustomDraw(true);
    clearResultMarkers();
    mode.value = null;
    resultText.value = '等待绘制';
    draw.changeMode('simple_select');
    customDrawMode = nextMode;
};

const handleCommand = ({ id }: { id: string }) => {
    if (id === 'distance' || id === 'area') startMeasure(id);
    if (id === 'draw-point') startStandardDraw('draw_point');
    if (id === 'draw-line') startStandardDraw('draw_line_string');
    if (id === 'draw-polygon') startStandardDraw('draw_polygon');
    if (id === 'draw-rectangle') startCustomDraw('rectangle');
    if (id === 'draw-circle') startCustomDraw('circle');
    if (id === 'clear') clearMeasure();
};

onMounted(() => {
    emitter.on('map-tool:command', handleCommand);
    emitter.on('map-tool:clear', clearMeasure);
    if (connectMap()) return;
    connectTimer = window.setInterval(() => {
        if (!connectMap() || !connectTimer) return;
        window.clearInterval(connectTimer);
        connectTimer = null;
    }, 200);
});

onBeforeUnmount(() => {
    emitter.off('map-tool:command', handleCommand);
    emitter.off('map-tool:clear', clearMeasure);
    if (connectTimer) window.clearInterval(connectTimer);
    if (updateFrame !== null) window.cancelAnimationFrame(updateFrame);
    clearResultMarkers();
    if (map) {
        map.off('draw.create', updateResult);
        map.off('draw.update', updateResult);
        map.off('click', scheduleResultUpdate);
        map.off('mousemove', scheduleResultUpdate);
        map.off('click', handleCustomDrawClick);
        map.off('mousemove', handleCustomDrawMove);
        if (draw) map.removeControl(draw);
    }
    map = null;
    draw = null;
});

const measureStyles = [
    { id: 'measure-line', type: 'line', filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ff9d3d', 'line-width': 3, 'line-dasharray': [1.2, 1] } },
    { id: 'measure-polygon-fill', type: 'fill', filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']], paint: { 'fill-color': '#ff9d3d', 'fill-opacity': 0.2 } },
    { id: 'measure-polygon-outline', type: 'line', filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffb45f', 'line-width': 2 } },
    { id: 'measure-points', type: 'circle', filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint']], paint: { 'circle-radius': 4, 'circle-color': '#fff3df', 'circle-stroke-color': '#e47b22', 'circle-stroke-width': 2 } },
];
</script>

<style scoped>
.measure-status{position:fixed;left:50%;top:92px;z-index:1108;display:inline-grid;width:max-content;max-width:min(560px,calc(100vw - 32px));grid-template-columns:auto auto auto auto;align-items:center;gap:12px;padding:9px 12px;border:1px solid rgba(83,190,220,.32);background:rgba(4,24,45,.9);box-shadow:0 8px 24px rgba(0,8,20,.28);backdrop-filter:blur(10px);transform:translateX(-50%);color:rgba(225,246,253,.6);font-size:12px}.measure-status__type{padding-right:12px;border-right:1px solid rgba(91,183,215,.2);color:#dffaff}.measure-status strong{color:#76e1f2;font:500 15px 'Fira Code',monospace}.measure-status button{height:26px;padding:0 11px;border:1px solid rgba(54,217,255,.32);background:rgba(54,217,255,.08);color:#dffaff;font-size:12px;cursor:pointer}.measure-status button:hover{border-color:rgba(54,217,255,.65);background:rgba(54,217,255,.14)}.measure-status-enter-active,.measure-status-leave-active{transition:opacity .2s ease,transform .24s ease}.measure-status-enter-from,.measure-status-leave-to{opacity:0;transform:translate(-50%,-8px)}@media(max-width:768px){.measure-status{top:82px;width:max-content;max-width:calc(100vw - 24px);grid-template-columns:auto auto auto}.measure-status>span:nth-child(3){display:none}}
:global(.mapboxgl-marker.map-measure-label){position:absolute;top:0;left:0;padding:3px 7px;border:1px solid rgba(255,173,83,.72);background:rgba(42,22,7,.9);box-shadow:0 3px 10px rgba(23,10,1,.38),0 0 7px rgba(255,145,43,.18);color:#ffe2bd;font:500 11px/1.35 'Fira Code',monospace;display:inline-block;width:max-content;max-width:180px;box-sizing:border-box;overflow:visible;white-space:nowrap;pointer-events:none}:global(.map-measure-label::after){content:'';position:absolute;left:50%;bottom:-4px;width:6px;height:6px;border-right:1px solid rgba(255,173,83,.72);border-bottom:1px solid rgba(255,173,83,.72);background:rgba(42,22,7,.9);transform:translateX(-50%) rotate(45deg)}:global(.map-measure-label--total),:global(.map-measure-label--area){padding:4px 9px;border-color:#ffae55;background:rgba(74,34,5,.94);color:#fff0d6;font-size:12px;box-shadow:0 4px 12px rgba(23,10,1,.42),0 0 9px rgba(255,145,43,.25)}:global(.map-measure-label--segment){opacity:.9}
</style>
