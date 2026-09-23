<template>
    <main class="relative min-h-[100dvh] overflow-hidden bg-[#050d18] text-slate-100">
        <div class="absolute inset-0 bg-[linear-gradient(108deg,#06111f_0%,#08243a_48%,#050d18_48%,#050d18_100%)] max-lg:bg-[linear-gradient(145deg,#08243a_0%,#050d18_62%)]" />
        <div class="login-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div class="absolute -left-40 top-1/3 size-[520px] rounded-full bg-screen-primary/[0.08] blur-[100px]" aria-hidden="true" />
        <div class="absolute bottom-0 left-0 h-px w-[48%] bg-gradient-to-r from-transparent via-screen-primary/40 to-screen-primary/10" aria-hidden="true" />

        <header class="absolute inset-x-0 top-0 z-20 flex h-[88px] items-center justify-between px-[clamp(24px,5vw,80px)] max-sm:h-[72px]">
            <div class="flex items-center gap-4">
                <span class="relative grid size-10 place-items-center border border-screen-primary/45 bg-screen-primary/[0.06]" aria-hidden="true">
                    <span class="size-3 border border-screen-primary shadow-[0_0_12px_rgba(54,217,255,0.65)]" />
                    <span class="absolute -right-1 -top-1 size-2 border-r border-t border-screen-primary" />
                    <span class="absolute -bottom-1 -left-1 size-2 border-b border-l border-screen-primary" />
                </span>
                <strong class="text-lg font-semibold tracking-[0.14em] text-sky-50 sm:text-xl">{{ platformTitle }}</strong>
            </div>
            <span class="hidden items-center gap-2 text-xs tracking-[0.16em] text-sky-100/45 sm:flex">
                <i class="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
                安全访问
            </span>
        </header>

        <section class="relative z-10 grid min-h-[100dvh] grid-cols-[minmax(0,1fr)_minmax(460px,38vw)] pt-[88px] max-lg:grid-cols-1 max-sm:pt-[72px]">
            <div class="relative flex items-center px-[clamp(32px,8vw,140px)] pb-16 max-lg:hidden">
                <div class="relative z-10 max-w-[660px]">
                    <p class="mb-5 flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-screen-primary">
                        <span class="h-px w-10 bg-screen-primary/70" />
                        城市空间数据中枢
                    </p>
                    <h1 class="m-0 text-[clamp(42px,4.2vw,68px)] font-semibold leading-[1.18] tracking-[0.03em] text-white">
                        连接城市数据<br />掌握实时运行态势
                    </h1>
                    <p class="mt-8 max-w-[540px] text-base leading-8 tracking-[0.04em] text-sky-100/55">
                        统一汇聚地图、事件、设备与区域信息，为城市运行监测、风险研判和指挥调度提供空间化支撑。
                    </p>

                    <div class="mt-14 grid max-w-[540px] grid-cols-3 border-y border-sky-200/10 py-5">
                        <div class="border-r border-sky-200/10 pr-6">
                            <strong class="block text-sm font-medium text-sky-50/90">一图统览</strong>
                            <span class="mt-1.5 block text-xs text-sky-100/35">空间资源汇聚</span>
                        </div>
                        <div class="border-r border-sky-200/10 px-6">
                            <strong class="block text-sm font-medium text-sky-50/90">实时感知</strong>
                            <span class="mt-1.5 block text-xs text-sky-100/35">运行态势监测</span>
                        </div>
                        <div class="pl-6">
                            <strong class="block text-sm font-medium text-sky-50/90">协同指挥</strong>
                            <span class="mt-1.5 block text-xs text-sky-100/35">资源快速调度</span>
                        </div>
                    </div>
                </div>

                <div class="coordinate-mark absolute bottom-[10%] right-[5%] size-[280px] opacity-35" aria-hidden="true">
                    <span class="absolute inset-0 rounded-full border border-screen-primary/20" />
                    <span class="absolute inset-[34px] rounded-full border border-dashed border-screen-primary/25" />
                    <span class="absolute inset-[92px] rounded-full border border-screen-primary/45" />
                    <span class="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-screen-primary/35 to-transparent" />
                    <span class="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-screen-primary/35 to-transparent" />
                    <span class="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-screen-primary shadow-[0_0_16px_#36d9ff]" />
                </div>
            </div>

            <div class="relative flex items-center justify-center border-l border-screen-primary/10 bg-[#050d18]/75 px-[clamp(24px,5vw,72px)] pb-16 backdrop-blur-[2px] max-lg:border-l-0 max-lg:bg-[#050d18]/55 max-sm:items-start max-sm:pt-12">
                <div class="w-full max-w-[410px]">
                    <div class="mb-10">
                        <span class="mb-5 block h-1 w-9 bg-screen-primary shadow-[0_0_10px_rgba(54,217,255,0.5)]" />
                        <h2 class="m-0 text-[30px] font-semibold tracking-[0.08em] text-white">账号登录</h2>
                        <p class="mb-0 mt-3 text-sm leading-6 text-sky-100/45">请输入您的系统账号和密码</p>
                    </div>

                    <n-form ref="formRef" :model="formData" :rules="rules" :show-require-mark="false" size="large" @submit.prevent="onSubmit">
                        <n-form-item label="账号" path="usercode">
                            <n-input v-model:value="formData.usercode" :allow-input="noSideSpace" placeholder="请输入账号" clearable autocomplete="username" @keyup.enter="onSubmit">
                                <template #prefix><RiUser3Line class="h-5 w-5 text-screen-primary/65" /></template>
                            </n-input>
                        </n-form-item>
                        <n-form-item label="密码" path="password" class="mt-3">
                            <n-input v-model:value="formData.password" type="password" show-password-on="click" placeholder="请输入密码" autocomplete="current-password" @keyup.enter="onSubmit">
                                <template #prefix><RiLockPasswordLine class="h-5 w-5 text-screen-primary/65" /></template>
                            </n-input>
                        </n-form-item>
                        <p v-if="submitError" class="mb-0 mt-1 border-l-2 border-red-400/70 bg-red-400/[0.06] px-3 py-2.5 text-sm leading-5 text-red-200" role="alert">{{ submitError }}</p>
                        <button class="group mt-7 flex h-12 w-full items-center justify-center border border-screen-primary/60 bg-screen-primary/15 text-sm font-medium tracking-[0.2em] text-sky-50 transition-[background-color,border-color,transform] hover:border-screen-primary hover:bg-screen-primary/25 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="submitting">
                            <span>{{ submitting ? '正在登录…' : '登录系统' }}</span>
                            <span v-if="!submitting" class="ml-3 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                        </button>
                    </n-form>

                    <div class="mt-9 flex items-center gap-3 text-xs text-sky-100/25">
                        <span class="h-px flex-1 bg-sky-200/10" />
                        <span>请使用已授权账号访问</span>
                        <span class="h-px flex-1 bg-sky-200/10" />
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { RiLockPasswordLine, RiUser3Line } from '@remixicon/vue';
import { md5 } from 'js-md5';
import type { FormInst, FormRules } from 'naive-ui';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { appConfig } from '@/config';
import { CPLogin } from '@/services/auth';
import { useUserStore } from '@/stores/user';
import { noSideSpace } from '@/utils/utils';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const platformTitle = appConfig.platform.title;
const formRef = ref<FormInst | null>(null);
const submitting = ref(false);
const submitError = ref('');
const formData = reactive({ usercode: '', password: '' });
const rules: FormRules = {
    usercode: [{ required: true, message: '请输入账号', trigger: ['blur', 'input'] }],
    password: [{ required: true, message: '请输入密码', trigger: ['blur', 'input'] }],
};

const onSubmit = async () => {
    if (submitting.value) return;
    submitError.value = '';
    try {
        await formRef.value?.validate();
    } catch {
        return;
    }

    submitting.value = true;
    try {
        const userCode = formData.usercode.trim();
        const response = await CPLogin({
            userCode,
            password: md5(userCode + md5(formData.password)),
        });
        if ((response.code !== 0 && response.code !== 200) || !response.result) {
            submitError.value = response.message || response.msg || '登录失败，请检查账号和密码。';
            return;
        }
        userStore.setToken(response.result);
        if (!(await userStore.loadUserInfo())) {
            userStore.clearSession();
            submitError.value = '登录成功，但用户信息加载失败，请重试。';
            return;
        }
        window.$message?.success('登录成功');
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
        await router.replace(redirect.startsWith('/') ? redirect : '/');
    } catch {
        submitError.value = '登录请求失败，请检查网络后重试。';
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
.login-grid {
    background-image:
        linear-gradient(rgb(54 217 255 / 0.055) 1px, transparent 1px),
        linear-gradient(90deg, rgb(54 217 255 / 0.055) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(90deg, black 0%, rgb(0 0 0 / 0.8) 48%, transparent 78%);
}

:deep(.n-form-item-label) {
    color: rgb(224 242 254 / 0.72);
    font-size: 13px;
    letter-spacing: 0.08em;
}

:deep(.n-input) {
    --n-border: 1px solid rgb(125 211 252 / 0.16) !important;
    --n-border-hover: 1px solid rgb(54 217 255 / 0.45) !important;
    --n-border-focus: 1px solid rgb(54 217 255 / 0.7) !important;
    --n-box-shadow-focus: 0 0 0 2px rgb(54 217 255 / 0.08) !important;
    --n-color: rgb(2 10 22 / 0.5) !important;
    --n-color-focus: rgb(2 10 22 / 0.68) !important;
    --n-text-color: rgb(240 249 255 / 0.92) !important;
    --n-placeholder-color: rgb(186 230 253 / 0.28) !important;
    --n-border-radius: 0 !important;
}

:deep(.n-input-wrapper) {
    min-height: 48px;
    padding-inline: 14px;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
