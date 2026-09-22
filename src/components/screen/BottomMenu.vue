<template>
    <nav
        class="absolute bottom-5 left-1/2 z-menu flex -translate-x-1/2 items-center justify-center gap-x-3 max-md:w-[calc(100%_-_24px)] max-md:justify-start max-md:overflow-x-auto"
        aria-label="业务场景菜单"
    >
        <RouterLink
            v-for="item in items"
            :key="item.id"
            :to="item.path"
            class="relative flex h-[70px] w-[122px] shrink-0 items-center justify-center whitespace-nowrap border-0 bg-screen-menu bg-center bg-no-repeat text-[15px] text-sky-50/75 transition-all duration-200 hover:-translate-y-0.5 hover:text-white active:translate-y-px max-md:w-[104px] max-md:text-xs"
            :class="activeId === item.id ? 'bg-screen-menu-active text-white' : ''"
            :aria-current="activeId === item.id ? 'page' : undefined"
        >
            <span>{{ item.name }}</span>
        </RouterLink>
    </nav>
</template>

<script setup lang="ts">
import type { ScreenMenuItem } from '@/types/screen';

defineProps<{ items: ScreenMenuItem[]; activeId: string }>();
</script>
