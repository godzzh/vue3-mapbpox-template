<template>
    <span class="hidden" aria-hidden="true" />
</template>

<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';

window.$message = useMessage();
window.$dialog = useDialog();
window.$notification = useNotification();
window.$loadingBar = useLoadingBar();
</script>
