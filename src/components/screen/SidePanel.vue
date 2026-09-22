<template>
    <aside
        class="pointer-events-none absolute inset-y-0 z-[1001] w-0"
        :class="side === 'left' ? 'left-0' : 'right-0 max-lg:hidden'"
    >
        <div
            class="screen-panel-shell pointer-events-auto absolute bottom-[40px] top-[98px] w-[min(380px,30vw)] transition-transform duration-500 ease-in-out max-lg:w-[min(340px,78vw)]"
            :class="[
                side === 'left' ? 'left-[40px]' : 'right-[100px]',
                !expanded &&
                    (side === 'left'
                        ? '-translate-x-[calc(150%+48px)]'
                        : 'translate-x-[calc(150%+110px)]'),
            ]"
        >
            <div
                class="screen-panel-frame relative h-full"
                :class="side === 'left' ? 'screen-panel-frame--left' : 'screen-panel-frame--right'"
            >
                <svg
                    class="screen-panel-outline pointer-events-none absolute -inset-px z-[2] h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-visible fill-none stroke-[rgba(93,185,218,0.58)] [filter:drop-shadow(0_0_2px_rgba(54,217,255,0.1))] [stroke-width:1] [vector-effect:non-scaling-stroke]"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <polygon
                        v-if="side === 'left'"
                        points="4.8,0.2 99.8,0.2 99.8,97.4 95.2,99.8 0.2,99.8 0.2,2.6"
                    />
                    <polygon
                        v-else
                        points="0.2,0.2 95.2,0.2 99.8,2.6 99.8,99.8 4.8,99.8 0.2,97.4"
                    />
                </svg>
                <div class="screen-panel-fill pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
                <div class="screen-panel-surface pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
                <div class="screen-panel-glow pointer-events-none absolute inset-0 z-[2] opacity-[0.34]" aria-hidden="true" />

                <i class="panel-corner panel-corner--top pointer-events-none absolute z-[3]" aria-hidden="true" />
                <i class="panel-corner panel-corner--bottom pointer-events-none absolute z-[3]" aria-hidden="true" />
                <i class="panel-rail absolute top-0 z-[3] h-px w-[44%]" aria-hidden="true" />

                <section class="absolute inset-0 z-[2] text-[rgba(232,247,255,0.96)] [text-shadow:0_1px_2px_rgba(0,7,16,0.45)]" :aria-hidden="!expanded">
                    <n-scrollbar class="screen-panel-scrollbar h-full" content-class="screen-panel-scrollbar__content">
                        <slot />
                    </n-scrollbar>
                </section>
            </div>
        </div>

        <button
            class="pointer-events-auto fixed top-1/2 z-[1002] h-[60vh] w-[32px] -translate-y-1/2 overflow-visible border-0 bg-transparent p-0 transition-transform active:scale-[0.98]"
            :class="side === 'left' ? 'left-0' : 'right-0'"
            type="button"
            :aria-label="`${expanded ? '收起' : '展开'}${side === 'left' ? '左侧' : '右侧'}面板`"
            :aria-expanded="expanded"
            @click="$emit('update:expanded', !expanded)"
        >
            <img
                :src="side === 'left' ? '/static/images/bg_left.png' : '/static/images/bg_right.png'"
                alt=""
                class="absolute inset-0 h-full w-full object-fill"
            />
            <img
                src="/static/images/arrow.png"
                alt=""
                class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500"
                :class="side === 'left' ? (expanded ? '' : 'rotate-180') : expanded ? 'rotate-180' : ''"
            />
        </button>
    </aside>
</template>

<script setup lang="ts">
defineProps<{ side: 'left' | 'right'; expanded: boolean }>();
defineEmits<{ 'update:expanded': [value: boolean] }>();
</script>

<style scoped>
.screen-panel-frame { animation: panel-shell-enter .62s cubic-bezier(.22,1,.36,1); }
.screen-panel-frame--right { animation-name: panel-shell-enter-right; }
@keyframes panel-shell-enter { from { opacity:0; transform:translate3d(calc(-100% - 48px),0,0); } to { opacity:1; transform:translate3d(0,0,0); } }
@keyframes panel-shell-enter-right { from { opacity:0; transform:translate3d(calc(100% + 110px),0,0); } to { opacity:1; transform:translate3d(0,0,0); } }
@media (prefers-reduced-motion: reduce) { .screen-panel-frame { animation-duration:.01ms; } }
.screen-panel-frame {
    --panel-corner-size: 14px;
    --panel-shape-left: polygon(calc(var(--panel-corner-size) + 4px) 0, 100% 0, 100% calc(100% - var(--panel-corner-size) - 4px), calc(100% - var(--panel-corner-size) - 4px) 100%, 0 100%, 0 calc(var(--panel-corner-size) + 4px) );
    --panel-shape-right: polygon(0 0, calc(100% - var(--panel-corner-size) - 4px) 0, 100% calc(var(--panel-corner-size) + 4px), 100% 100%, calc(var(--panel-corner-size) + 4px) 100%, 0 calc(100% - var(--panel-corner-size) - 4px));
}
.screen-panel-frame--left { --panel-shape: var(--panel-shape-left); }
.screen-panel-frame--right { --panel-shape: var(--panel-shape-right); }
.screen-panel-outline polygon { vector-effect: non-scaling-stroke; }
.screen-panel-fill {
    background: linear-gradient(155deg, rgba(6, 27, 61, 0.42), rgba(3, 16, 40, 0.34) 55%, rgba(2, 11, 31, 0.4));
    clip-path: var(--panel-shape);
    box-shadow:
        inset 0 1px rgba(173, 222, 246, 0.055),
        inset 1px 0 rgba(76, 157, 205, 0.025),
        0 18px 30px rgba(0, 7, 17, 0.2);
}
.screen-panel-surface {
    background: rgba(6, 28, 47, 0.75);
    clip-path: var(--panel-shape);
    /* -webkit-backdrop-filter: blur(28px) saturate(104%) brightness(0.96); */
    /* backdrop-filter: blur(28px) saturate(104%) brightness(0.96); */
}
.screen-panel-glow {
    background:
        linear-gradient(90deg, rgba(72, 151, 201, 0.026) 1px, transparent 1px),
        linear-gradient(rgba(72, 151, 201, 0.018) 1px, transparent 1px);
    background-size: 30px 30px;
    clip-path: var(--panel-shape);
    mask-image: linear-gradient(to bottom, black, transparent 68%);
}
.panel-rail {
    background: linear-gradient(90deg, transparent, rgba(76, 168, 207, 0.68), rgba(37, 112, 159, 0.1));
    box-shadow: 0 0 8px rgba(47, 136, 180, 0.22);
}
.screen-panel-frame--left .panel-rail { left: 20px; }
.screen-panel-frame--right .panel-rail { right: 20px; transform: scaleX(-1); }
.panel-corner {
    width: var(--panel-corner-size);
    height: var(--panel-corner-size);
    background: linear-gradient(135deg, rgba(135, 235, 255, 0.92), rgba(54, 217, 255, 0.16));
    filter: drop-shadow(0 0 4px rgba(54, 217, 255, 0.36));
}
.screen-panel-frame--left .panel-corner--top { left: -1px; top: -1px; clip-path: polygon(0 0, 100% 0, 0 100%); }
.screen-panel-frame--left .panel-corner--bottom { right: -1px; bottom: -1px; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
.screen-panel-frame--right .panel-corner--top { right: -1px; top: -1px; clip-path: polygon(0 0, 100% 0, 100% 100%); }
.screen-panel-frame--right .panel-corner--bottom { left: -1px; bottom: -1px; clip-path: polygon(0 0, 100% 100%, 0 100%); }
:deep(.screen-panel-scrollbar__content) {
    min-height: 100%;
    padding: 18px;
}
:deep(.screen-panel-scrollbar .n-scrollbar-rail.n-scrollbar-rail--vertical) {
    right: 5px;
    width: 4px;
}
:deep(.screen-panel-scrollbar .n-scrollbar-rail__scrollbar) {
    background: rgba(54, 217, 255, 0.38);
    box-shadow: 0 0 5px rgba(54, 217, 255, 0.18);
}
</style>
