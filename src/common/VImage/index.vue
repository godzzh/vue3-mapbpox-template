<template><n-image :fallback-src="fallback" v-bind="{width:120,'object-fit':'cover',...$attrs}"><template #placeholder><div class="box-border flex items-center justify-center bg-[rgba(11,35,61,.6)] p-2 text-xs text-[rgba(225,243,251,.58)]" :style="placeholderStyle"><span v-if="$attrs.src" class="v-image-loading">图片加载中</span><img v-else class="max-h-full max-w-full object-contain" :src="fallback" alt="暂无图片"/></div></template></n-image></template>
<script setup lang="ts">
import { computed,useAttrs } from 'vue';
defineOptions({inheritAttrs:false});withDefaults(defineProps<{fallback?:string}>(),{fallback:'/static/images/common/noImg.png'});const attrs=useAttrs();
const placeholderStyle=computed(()=>({width:typeof attrs.width==='number'?`${attrs.width}px`:String(attrs.width||'120px'),height:typeof attrs.height==='number'?`${attrs.height}px`:String(attrs.height||attrs.width||'120px')}));
</script>
<style scoped>.v-image-loading::after{content:'.';animation:dots 1.5s steps(3,end) infinite}@keyframes dots{0%{content:'.'}50%{content:'..'}100%{content:'...'}}</style>
