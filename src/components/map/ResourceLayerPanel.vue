<template>
    <div class="fixed right-[104px] top-[110px] z-[1109] max-[1024px]:right-[70px] max-[1024px]:top-24">
        <Transition name="right-modal">
            <TechModalFrame
                v-if="visible"
                class="w-[330px]"
                width-class="w-[330px]"
                aria-label="资源图层"
                @close="$emit('update:visible', false)"
            >
                <div class="min-h-[240px] p-4 pt-3">
                    <MapPopupTitle title="资源图层" />
                    <div v-if="groups.length" class="max-h-[520px] overflow-y-auto pr-1">
                        <section v-for="group in groups" :key="group.functionCode" class="border-b border-sky-200/10 py-3.5 first:pt-1 last:border-b-0">
                            <header class="mb-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-2.5">
                                <span class="h-3.5 w-[3px] bg-screen-primary shadow-[0_0_7px_rgba(54,217,255,0.45)]" aria-hidden="true" />
                                <strong class="truncate text-[13px] font-medium tracking-[0.08em] text-sky-50/90">{{ group.functionName }}</strong>
                                <small class="font-mono text-[10px] text-sky-100/35">{{ group.children.length }} 项</small>
                            </header>
                            <div v-if="group.children.length" class="grid grid-cols-2 gap-1.5">
                                <button
                                    v-for="layer in group.children"
                                    :key="layer.functionCode"
                                    type="button"
                                    class="rounded-[6px] group grid min-h-[54px] grid-cols-[36px_minmax(0,1fr)_12px] items-center gap-2 border px-2 py-2 text-left transition-[border-color,background-color,transform] hover:border-sky-200/25 hover:bg-sky-400/[0.07] active:translate-y-px"
                                    :class="layer.metadata && activeLayerIds.includes(layer.metadata.layerId) ? 'border-screen-primary/45 bg-screen-primary/10' : 'border-sky-200/10 bg-sky-400/[0.035]'"
                                    :title="layer.metadata?.layerId || layer.functionName"
                                    :aria-pressed="Boolean(layer.metadata && activeLayerIds.includes(layer.metadata.layerId))"
                                    @click="$emit('toggle', layer.metadata?.layerId || '')"
                                >
                                    <span
                                        class="grid size-9 place-items-center transition-colors"
                                    >
                                        <img
                                            v-if="layer.iconUrl"
                                            class="max-h-8 max-w-8 object-contain transition-[filter,opacity,transform] group-hover:scale-105"
                                            :class="layer.metadata && activeLayerIds.includes(layer.metadata.layerId) ? '' : 'grayscale-[80%] opacity-55'"
                                            :src="layer.iconUrl"
                                            alt=""
                                        />
                                        <i
                                            v-else
                                            class="ri-map-pin-line text-xl"
                                            :class="layer.metadata && activeLayerIds.includes(layer.metadata.layerId) ? 'text-sky-200/70' : 'text-slate-400/50'"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span
                                        class="line-clamp-2 text-xs font-medium leading-4 transition-colors"
                                        :class="layer.metadata && activeLayerIds.includes(layer.metadata.layerId) ? 'text-sky-50/85' : 'text-slate-400/60'"
                                    >{{ layer.functionName }}</span>
                                    <span
                                        class="size-1.5 justify-self-end rounded-full transition-[background-color,box-shadow]"
                                        :class="layer.metadata && activeLayerIds.includes(layer.metadata.layerId) ? 'bg-screen-primary shadow-[0_0_6px_rgba(54,217,255,0.65)]' : 'bg-slate-500/40'"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            <p v-else class="m-0 border-y border-sky-200/5 py-3 text-center text-xs text-sky-100/30">该分类暂无图层</p>
                        </section>
                    </div>
                    <div v-else class="grid min-h-[168px] place-content-center justify-items-center gap-2 border-y border-sky-200/10 text-center">
                        <span class="grid size-10 place-items-center border border-sky-200/15 bg-sky-400/[0.04] text-xl text-sky-200/45" aria-hidden="true">
                            <i class="ri-stack-line" />
                        </span>
                        <strong class="text-xs font-medium tracking-[0.08em] text-sky-50/70">暂无资源图层配置</strong>
                        <span class="max-w-[220px] text-xs leading-5 text-sky-100/35">请在资源图层应用中配置图层分类及二级图层。</span>
                    </div>
                </div>
            </TechModalFrame>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import MapPopupTitle from '@/components/map/MapPopupTitle.vue';
import TechModalFrame from '@/components/screen/TechModalFrame.vue';
import type { ResourceLayerGroup } from '@/services/function';

defineProps<{ visible: boolean; groups: ResourceLayerGroup[]; activeLayerIds: string[] }>();
defineEmits<{
    'update:visible': [value: boolean];
    toggle: [layerId: string];
}>();
</script>

<style scoped>
.right-modal-enter-active,
.right-modal-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.25s ease;
}
.right-modal-enter-from,
.right-modal-leave-to {
    opacity: 0;
    transform: scale(0);
}
</style>
