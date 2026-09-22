<template><n-modal :show="show" :auto-focus="false" v-bind="$attrs" @mask-click="close"><section class="overflow-hidden border border-[rgba(88,184,219,.38)] bg-[rgba(5,22,48,.96)] text-[#eaf8ff] shadow-[0_20px_60px_rgba(0,5,18,.5)]" :style="{width}" role="dialog" :aria-label="title"><header class="modal-page-header flex h-11 items-center justify-between border-b border-[rgba(91,184,219,.26)] px-4"><strong class="text-[15px] font-semibold">{{ title }}</strong><button class="grid h-[30px] w-[30px] cursor-pointer place-items-center border-0 bg-transparent text-[rgba(235,249,255,.7)] hover:text-white" type="button" aria-label="关闭弹窗" @click="close"><RiCloseLine class="w-[19px]"/></button></header><n-spin :show="loading"><n-scrollbar :style="{maxHeight:contentMaxHeight}"><div class="px-4 py-5"><slot/></div></n-scrollbar></n-spin><footer v-if="$slots.footer" class="flex justify-end gap-3 px-4 pb-3.5"><slot name="footer"/></footer></section></n-modal></template>
<script setup lang="ts">
import { RiCloseLine } from '@remixicon/vue';
defineOptions({inheritAttrs:false});withDefaults(defineProps<{show?:boolean;title?:string;loading?:boolean;width?:string;contentMaxHeight?:string}>(),{show:false,title:'',loading:false,width:'min(680px, calc(100vw - 32px))',contentMaxHeight:'calc(100vh - 240px)'});
const emit=defineEmits<{'update:show':[value:boolean];close:[]}>();const close=()=>{emit('update:show',false);emit('close')};
</script>
<style scoped>
.modal-page-header {
    background: linear-gradient(90deg, rgba(22, 81, 119, 0.68), rgba(8, 38, 69, 0.72));
}
</style>
