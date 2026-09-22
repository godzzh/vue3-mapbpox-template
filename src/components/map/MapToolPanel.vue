<template>
    <!--
        两个锚点保持独立且常驻，避免 tool 变为 null 时父级定位 class 同步丢失，
        导致离场动画先跳回 (0, 0) 再缩放。
    -->
    <div class="fixed right-[104px] top-[110px] z-[1109] max-[1024px]:right-[70px] max-[1024px]:top-24">
        <Transition name="search-panel">
            <TechModalFrame
                v-if="tool === 'search'"
                class="map-tool-panel--search"
                width-class="w-[360px]"
                aria-label="资源搜索"
                @close="$emit('close')"
            >
                <ResourceSearchPanel />
            </TechModalFrame>
        </Transition>
    </div>

    <div class="fixed right-[104px] top-[286px] z-[1109] max-[1024px]:right-[70px] max-[1024px]:top-[250px]">
        <Transition name="tools-panel">
            <TechModalFrame
                v-if="tool === 'tools'"
                class="map-tool-panel--tools"
                width-class="w-[340px]"
                aria-label="地图工具"
                @close="$emit('close')"
            >
                <MapToolsPanel />
            </TechModalFrame>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import MapToolsPanel from '@/components/map/MapToolsPanel.vue';
import ResourceSearchPanel from '@/components/map/ResourceSearchPanel.vue';
import TechModalFrame from '@/components/screen/TechModalFrame.vue';

defineProps<{ tool: 'search' | 'tools' | null }>();
defineEmits<{ close: [] }>();
</script>

<style scoped>
/*
 * 弹框右边缘距菜单图标中心约 42px。动画原点放在对应图标中心，
 * 使打开和关闭都明确地从触发菜单展开、向触发菜单收拢。
 */
.map-tool-panel--search {
    transform-origin: calc(100% + 42px) 30px;
}

.map-tool-panel--tools {
    transform-origin: calc(100% + 42px) 35px;
}

.search-panel-enter-active,
.search-panel-leave-active,
.tools-panel-enter-active,
.tools-panel-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.25s ease;
}

.search-panel-enter-from,
.search-panel-leave-to,
.tools-panel-enter-from,
.tools-panel-leave-to {
    opacity: 0;
    transform: scale(0);
}

@media (max-width: 1024px) {
    .map-tool-panel--search,
    .map-tool-panel--tools {
        transform-origin: calc(100% + 36px) 27px;
    }
}
</style>
