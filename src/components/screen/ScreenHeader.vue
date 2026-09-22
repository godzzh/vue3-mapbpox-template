<template>
    <header
        class="pointer-events-none absolute inset-x-0 top-0 z-[1200] h-[80px] bg-screen-header bg-[length:100%_80px] bg-top bg-no-repeat"
    >
        <div class="absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap text-center">
            <h1 class="m-0 bg-gradient-to-b from-white via-sky-100 to-sky-300 bg-clip-text text-[clamp(22px,2vw,36px)] font-semibold tracking-[0.16em] text-transparent">
                {{ title }}
            </h1>
        </div>

        <div ref="menuRootRef" class="pointer-events-auto absolute right-8 top-3 max-md:hidden">
            <button
                class="user-trigger group relative flex h-12 min-w-[196px] items-center gap-3 overflow-hidden border-0 bg-[rgba(93,185,218,0.34)] px-2.5 pr-3 text-left shadow-[0_8px_28px_rgba(0,8,18,0.16)] transition duration-200 focus-visible:outline-none"
                :class="menuVisible ? 'is-open' : ''"
                type="button"
                :aria-expanded="menuVisible"
                aria-haspopup="menu"
                @click="menuVisible = !menuVisible"
            >
                <span class="user-trigger__shine absolute inset-px z-[1] opacity-0 transition-opacity duration-200" aria-hidden="true" />
                <span class="relative grid h-8 w-8 shrink-0 place-items-center bg-screen-primary/10 text-[13px] font-semibold text-sky-100 ring-1 ring-inset ring-screen-primary/40">
                    {{ userInitial }}
                    <i class="absolute -bottom-0.5 -right-0.5 h-2 w-2 border-2 border-[#08192b] bg-emerald-300 shadow-[0_0_7px_rgba(110,231,183,.8)]" />
                </span>
                <span class="relative min-w-0 flex-1">
                    <strong class="block truncate text-[13px] font-medium tracking-[0.02em] text-sky-50">{{ userName }}</strong>
                    <span class="mt-0.5 block max-w-[122px] truncate text-[10px] tracking-[0.04em] text-sky-200/45">{{ departmentName }}</span>
                </span>
                <RiArrowDownSLine class="relative h-4 w-4 shrink-0 text-sky-200/50 transition-transform duration-200" :class="menuVisible ? 'rotate-180 text-screen-primary' : ''" />
            </button>

            <Transition name="user-menu">
                <section v-if="menuVisible" class="user-menu absolute right-0 top-[58px] z-[10001] w-[264px] bg-transparent [filter:drop-shadow(0_22px_30px_rgba(0,6,15,0.5))_drop-shadow(0_0_7px_rgba(54,217,255,0.08))]" role="menu" aria-label="用户菜单">
                    <div class="user-menu__accent absolute left-4 right-12 top-0 z-[2] h-px" aria-hidden="true" />
                    <i class="user-menu__corner absolute right-px top-0 z-[3] h-[18px] w-[18px]" aria-hidden="true" />
                    <div class="relative p-4 pb-3">
                        <div class="flex items-center gap-3">
                            <div class="grid h-10 w-10 shrink-0 place-items-center bg-screen-primary/10 text-sm font-semibold text-sky-100 ring-1 ring-inset ring-screen-primary/35">{{ userInitial }}</div>
                            <div class="min-w-0">
                                <strong class="block truncate text-sm font-medium text-sky-50">{{ userName }}</strong>
                                <span class="mt-1 block truncate text-[11px] text-sky-200/45">账号 {{ userCode }}</span>
                            </div>
                            <span v-if="userStore.userInfo?.isAdmin" class="ml-auto border border-screen-primary/25 bg-screen-primary/[0.07] px-1.5 py-0.5 text-[9px] tracking-[0.12em] text-screen-primary/80">管理员</span>
                        </div>
                    </div>
                    <div class="mx-4 h-px bg-gradient-to-r from-transparent via-screen-primary/20 to-transparent" />
                    <dl class="m-0 grid gap-2.5 px-4 py-3 text-[11px]">
                        <div class="grid grid-cols-[48px_1fr] gap-2"><dt class="text-sky-200/35">所属单位</dt><dd class="m-0 truncate text-right text-sky-100/65" :title="departmentName">{{ departmentName }}</dd></div>
                        <div class="grid grid-cols-[48px_1fr] gap-2"><dt class="text-sky-200/35">登录地址</dt><dd class="m-0 text-right font-mono text-sky-100/55">{{ clientIP }}</dd></div>
                    </dl>
                    <button class="group/logout flex h-11 w-full items-center justify-between border-0 border-t border-red-300/10 bg-red-400/[0.035] px-4 text-left text-xs text-sky-100/65 transition-colors hover:bg-red-400/[0.09] hover:text-red-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-red-300/50 active:translate-y-px" type="button" role="menuitem" @click="confirmLogout">
                        <span class="flex items-center gap-2.5"><RiLogoutBoxRLine class="h-4 w-4 text-red-300/65 transition-transform group-hover/logout:translate-x-0.5" />退出登录</span>
                        <span class="font-mono text-[9px] tracking-[0.12em] text-red-200/25">LOG OUT</span>
                    </button>
                </section>
            </Transition>
        </div>
    </header>
</template>

<script setup lang="ts">
import { RiArrowDownSLine, RiLogoutBoxRLine } from '@remixicon/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { appConfig } from '@/config';
import { useUserStore } from '@/stores/user';

withDefaults(defineProps<{ title?: string }>(), { title: appConfig.platform.title });
const router = useRouter();
const userStore = useUserStore();
const menuRootRef = ref<HTMLElement | null>(null);
const menuVisible = ref(false);
const userName = computed(() => userStore.userInfo?.userName || userStore.userInfo?.userCode || '当前用户');
const userCode = computed(() => userStore.userInfo?.userCode || '--');
const departmentName = computed(() => userStore.userInfo?.departmentName || '未设置所属单位');
const clientIP = computed(() => userStore.userInfo?.loginInfo?.clientIP || '--');
const userInitial = computed(() => userName.value.trim().slice(0, 1).toUpperCase() || 'U');

const closeOnOutside = (event: PointerEvent) => {
    if (!menuRootRef.value?.contains(event.target as Node)) menuVisible.value = false;
};
onMounted(() => document.addEventListener('pointerdown', closeOnOutside));
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeOnOutside));

const confirmLogout = () => {
    menuVisible.value = false;
    window.$dialog?.warning({
        title: '退出当前账号',
        content: `确认退出 ${userName.value} 的登录状态？`,
        positiveText: '确认退出',
        negativeText: '取消',
        positiveButtonProps: { type: 'error' },
        onPositiveClick: async () => {
            await userStore.logout();
            await router.replace({ name: 'Login' });
        },
    });
};
</script>

<style scoped>
.user-trigger {
    --trigger-shape: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
    clip-path: var(--trigger-shape);
}
.user-trigger::before {
    content: '';
    position: absolute;
    inset: 1px;
    z-index: 0;
    background: linear-gradient(110deg, rgba(6, 23, 40, 0.96), rgba(10, 38, 61, 0.88));
    clip-path: var(--trigger-shape);
    transition: background 0.2s ease;
}
.user-trigger:hover,
.user-trigger.is-open {
    background: linear-gradient(110deg, rgba(54, 217, 255, 0.78), rgba(93, 185, 218, 0.28));
    box-shadow: 0 10px 32px rgba(0, 15, 28, 0.28), 0 0 12px rgba(54, 217, 255, 0.08);
}
.user-trigger:hover::before,
.user-trigger.is-open::before { background: linear-gradient(110deg, rgba(7, 28, 48, 0.98), rgba(13, 50, 77, 0.94)); }
.user-trigger__shine { background:linear-gradient(100deg,transparent 15%,rgba(54,217,255,.07) 52%,transparent 78%); clip-path:var(--trigger-shape); }
.user-trigger:hover .user-trigger__shine,.user-trigger.is-open .user-trigger__shine { opacity:1; }
.user-menu {
    --menu-shape: polygon(9px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px);
}
.user-menu::before {
    content: '';
    position: absolute;
    inset: 1px;
    z-index: 0;
    background: linear-gradient(145deg, rgba(10, 35, 57, 0.99), rgba(5, 19, 35, 0.99) 72%);
    clip-path: var(--menu-shape);
}
.user-menu::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(145deg, rgba(54, 217, 255, 0.72), rgba(93, 185, 218, 0.22));
    clip-path: var(--menu-shape);
}
.user-menu > :not(.user-menu__accent):not(.user-menu__corner) { position: relative; z-index: 1; }
.user-menu__accent { background:linear-gradient(90deg,var(--accent),rgba(54,217,255,.08)); box-shadow:0 0 10px rgba(54,217,255,.38); }
.user-menu__corner {
    background: linear-gradient(135deg, rgba(143, 237, 255, 0.92), rgba(54, 217, 255, 0.28));
    clip-path: polygon(100% 0, 100% 100%, 0 0);
    filter: drop-shadow(0 0 5px rgba(54, 217, 255, 0.42));
}
.user-menu-enter-active,.user-menu-leave-active { transition:opacity .18s ease,transform .2s ease; transform-origin:top right; }
.user-menu-enter-from,.user-menu-leave-to { opacity:0; transform:translateY(-6px) scale(.97); }
</style>
