<template><div ref="target" class="w-full" :style="{minHeight}"><slot v-if="hasAppeared"/><slot v-else name="placeholder"><n-empty description="内容加载中"/></slot></div></template>
<script setup lang="ts">
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
const props=withDefaults(defineProps<{once?:boolean;rootMargin?:string;minHeight?:string}>(),{once:true,rootMargin:'0px',minHeight:'120px'});
const emit=defineEmits<{show:[visible:boolean]}>();
const target=ref<HTMLElement|null>(null);const hasAppeared=ref(false);
const {stop}=useIntersectionObserver(target,(entries)=>{const entry=entries[0];if(!entry)return;const isIntersecting=entry.isIntersecting;if(isIntersecting)hasAppeared.value=true;else if(!props.once)hasAppeared.value=false;emit('show',isIntersecting);if(isIntersecting&&props.once)stop()},{rootMargin:props.rootMargin});
</script>
