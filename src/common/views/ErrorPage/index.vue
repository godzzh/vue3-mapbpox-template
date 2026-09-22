<template>
    <div class="flex h-screen flex-col items-center justify-center gap-y-4">
        <img class="w-[480px]" src="/static/icon/404.svg" />
        <span class="text-[var(--text-color-base-2)]">您访问的页面不存在或没有权限</span>
        <n-space>
            <n-button type="primary" @click="backHome">返回首页</n-button>
            <n-button @click="goLogin">重新登录</n-button>
        </n-space>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const backHome = () => router.replace('/home');
const goLogin = () => router.replace({ name: 'Login' });
</script>

