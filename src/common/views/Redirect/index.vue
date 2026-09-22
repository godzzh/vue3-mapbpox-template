<template>
    <div></div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { params, query } = route;
const { path } = params;

// path(.*) 在 vue-router 4 中可能匹配为字符串数组（多段路径），需拼回完整路径
const target = Array.isArray(path) ? `/${path.join('/')}` : `/${path}`;

router.replace({ path: target, query });
</script>
