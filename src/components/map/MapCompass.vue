<template>
    <button
        class="map-compass absolute bottom-2 left-2 z-[1000] grid size-8 cursor-pointer place-items-center rounded-full border border-[rgba(99,196,224,0.34)] p-0 backdrop-blur-lg transition-[border-color,box-shadow,transform] duration-200 hover:border-[rgba(103,218,238,0.72)] active:scale-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-[#8ceafa] motion-reduce:duration-[0.01ms]"
        type="button"
        title="恢复正北朝上"
        aria-label="地图指北针，点击恢复正北朝上"
        @click="resetNorth"
    >
        <span class="map-compass__dial relative grid size-[30px] place-items-center transition-transform duration-[120ms] ease-linear motion-reduce:duration-[0.01ms]" :style="{ transform: `rotate(${-bearing}deg)` }">
            <span class="absolute top-0 z-[1] text-[8px] font-semibold leading-none text-[#f4b878] [font-family:'Fira_Code',monospace] [text-shadow:0_0_5px_rgba(244,184,120,0.35)]">N</span>
            <svg class="size-[26px] overflow-visible" viewBox="0 0 40 40" aria-hidden="true">
                <path class="needle-north" d="M20 5 25 21 20 18 15 21Z" />
                <path class="needle-south" d="M20 35 15 19 20 22 25 19Z" />
                <circle cx="20" cy="20" r="2.2" />
            </svg>
        </span>
    </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const bearing = ref(0);
let map: MapboxMapInstance | null = null;
let connectTimer: number | null = null;

const syncBearing: MapboxEventHandler = () => {
    bearing.value = map?.getBearing() ?? 0;
};

const connectMap = () => {
    const currentMap = window.mapViewer;
    if (!currentMap || currentMap === map) return Boolean(currentMap);
    map?.off('rotate', syncBearing);
    map = currentMap;
    map.on('rotate', syncBearing);
    syncBearing({});
    return true;
};

const resetNorth = () => {
    if (!connectMap() || !map) return;
    map.rotateTo(0, { duration: 450 });
};

onMounted(() => {
    if (connectMap()) return;
    // MapConfig 和底图异步加载，短时等待全局地图实例后立即停止轮询。
    connectTimer = window.setInterval(() => {
        if (!connectMap() || !connectTimer) return;
        window.clearInterval(connectTimer);
        connectTimer = null;
    }, 200);
});

onBeforeUnmount(() => {
    if (connectTimer) window.clearInterval(connectTimer);
    map?.off('rotate', syncBearing);
    map = null;
});
</script>

<style scoped>
.map-compass {
    background: radial-gradient(circle, rgba(9, 38, 62, 0.88), rgba(3, 18, 35, 0.86));
    box-shadow:
        0 5px 18px rgba(0, 8, 18, 0.3),
        inset 0 0 0 1px rgba(173, 233, 247, 0.04);
}

.map-compass:hover {
    box-shadow:
        0 5px 20px rgba(0, 8, 18, 0.34),
        0 0 10px rgba(54, 217, 255, 0.13);
}

.map-compass__dial::before {
    content: '';
    position: absolute;
    inset: 2px;
    border: 1px solid rgba(144, 221, 239, 0.14);
    border-radius: 50%;
}
.map-compass svg circle {
    fill: #d9f7fc;
}
.needle-north {
    fill: #ef996f;
}
.needle-south {
    fill: rgba(107, 215, 234, 0.78);
}
</style>
