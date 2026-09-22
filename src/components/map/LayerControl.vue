<template>
    <div class="fixed right-[104px] top-[110px] z-[1109] max-[1024px]:right-[70px] max-[1024px]:top-24">
        <Transition name="right-modal">
            <TechModalFrame
                v-if="visible"
                class="w-[310px]"
                width-class="w-[310px]"
                aria-label="图层控制"
                @close="$emit('update:visible', false)"
            >
                <div class="min-h-[300px] p-4 pt-3">
                    <MapPopupTitle title="图层控制" />

                    <n-empty v-if="!layers.length" class="min-h-[210px] place-content-center" description="暂无图层配置" />
                    <ul v-else class="m-0 list-none p-0">
                        <li
                            v-for="layer in layers"
                            :key="layer.id"
                            class="grid min-h-[58px] grid-cols-[8px_1fr_auto] items-center gap-3 border-b border-sky-200/10"
                        >
                            <span
                                class="h-[22px] w-1.5 shadow-[0_0_8px_currentColor]"
                                :style="{ background: layer.color, color: layer.color }"
                            />
                            <div class="grid gap-1">
                                <strong class="text-[13px] font-medium text-sky-50/90">
                                    {{ layer.name }}
                                </strong>
                                <small class="text-[11px] text-screen-muted">
                                    {{ layer.description }}
                                </small>
                            </div>
                            <button
                                class="h-5 w-9 rounded-full border border-sky-200/30 bg-black/40 p-0.5 transition-colors"
                                :class="layer.visible ? 'border-screen-primary bg-screen-primary/20' : ''"
                                type="button"
                                role="switch"
                                :aria-label="`${layer.visible ? '关闭' : '开启'}${layer.name}`"
                                :aria-checked="layer.visible"
                                @click="$emit('toggle', layer.id)"
                            >
                                <span
                                    class="block h-3.5 w-3.5 rounded-full bg-slate-400 transition-all"
                                    :class="layer.visible ? 'translate-x-4 bg-screen-primary' : ''"
                                />
                            </button>
                        </li>
                    </ul>

                    <button
                        v-if="layers.length"
                        class="mt-3 h-[34px] w-full border border-screen-primary/30 bg-screen-primary/10 text-xs text-sky-100 transition-colors hover:border-screen-primary/60 hover:bg-screen-primary/15 active:translate-y-px"
                        type="button"
                        @click="$emit('reset')"
                    >
                        恢复默认图层
                    </button>
                </div>
            </TechModalFrame>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui';

import MapPopupTitle from '@/components/map/MapPopupTitle.vue';
import TechModalFrame from '@/components/screen/TechModalFrame.vue';
import type { LayerOption } from '@/types/screen';

defineProps<{ visible: boolean; layers: LayerOption[] }>();
defineEmits<{
    'update:visible': [value: boolean];
    toggle: [id: string];
    reset: [];
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
