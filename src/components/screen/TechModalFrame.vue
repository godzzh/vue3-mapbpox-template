<template>
    <section
        class="relative origin-top-right drop-shadow-[0_0_2px_#36d9ff]"
        :class="widthClass"
    >
        <div
            class="absolute -inset-px bg-screen-primary [clip-path:polygon(8px_100%,calc(100%_-_8px)_100%,100%_calc(100%_-_8px),100%_34px,calc(100%_-_12px)_22px,calc(100%_-_64px)_22px,calc(100%_-_76px)_0,8px_0,0_8px,0_calc(100%_-_8px))]"
            aria-hidden="true"
        />
        <div
            class="relative min-h-[80px] bg-[linear-gradient(139deg,#113353_6%,rgba(7,15,43,0.96)_61%)] [clip-path:polygon(8px_100%,calc(100%_-_8px)_100%,100%_calc(100%_-_8px),100%_34px,calc(100%_-_12px)_22px,calc(100%_-_64px)_22px,calc(100%_-_76px)_0,8px_0,0_8px,0_calc(100%_-_8px))]"
        >
            <slot />
        </div>

        <i
            class="pointer-events-none absolute -left-1.5 -top-1.5 h-5 w-6 bg-screen-primary/80 drop-shadow-[0_0_2px_#36d9ff] [clip-path:polygon(3px_100%,3px_calc(50%_+_1.5px),50%_3px,100%_3px,100%_0,calc(50%_-_1.5px)_0,0_50%,0_100%)]"
            aria-hidden="true"
        />
        <i
            class="pointer-events-none absolute -bottom-1.5 -right-1.5 h-5 w-6 rotate-180 bg-screen-primary/80 drop-shadow-[0_0_2px_#36d9ff] [clip-path:polygon(3px_100%,3px_calc(50%_+_1.5px),50%_3px,100%_3px,100%_0,calc(50%_-_1.5px)_0,0_50%,0_100%)]"
            aria-hidden="true"
        />
        <i
            class="pointer-events-none absolute right-14 top-0 h-[15px] w-1.5 skew-x-[30deg] bg-screen-primary"
            aria-hidden="true"
        />
        <i
            class="pointer-events-none absolute right-11 top-0 h-[15px] w-1.5 skew-x-[30deg] bg-screen-primary"
            aria-hidden="true"
        />
        <i
            class="pointer-events-none absolute right-8 top-0 h-[15px] w-1.5 skew-x-[30deg] bg-screen-primary"
            aria-hidden="true"
        />

        <button
            v-if="closable"
            class="absolute -top-1 right-0 grid h-6 w-6 place-items-center border-0 bg-transparent p-0 text-screen-primary opacity-75 transition-opacity hover:opacity-100"
            type="button"
            aria-label="关闭面板"
            @click="$emit('close')"
        >
            <RiCloseLine class="h-6 w-6" />
        </button>
    </section>
</template>

<script setup lang="ts">
import { RiCloseLine } from '@remixicon/vue';

withDefaults(
    defineProps<{
        closable?: boolean;
        widthClass?: string;
    }>(),
    {
        closable: true,
        widthClass: 'w-[310px]',
    },
);

defineEmits<{ close: [] }>();
</script>
