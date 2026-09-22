<template><div class="flex gap-x-3 gap-y-1.5" :class="vertical ? 'flex-col items-start' : 'flex-wrap items-center'"><n-checkbox :checked="isAllChecked" :indeterminate="isIndeterminate" :label="text" :size="size" @update:checked="toggleAll" /><n-checkbox v-for="item in options" :key="String(item.value)" :checked="modelValue.includes(item.value)" :disabled="item.disabled" :label="item.label" :size="size" @update:checked="toggleItem($event,item.value)" /></div></template>
<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue';
export interface CheckGroupOption<Value extends string | number=string>{label:string;value:Value;disabled?:boolean}
const props=withDefaults(defineProps<{modelValue:T[];options:CheckGroupOption<T>[];text?:string;size?:'small'|'medium'|'large';vertical?:boolean}>(),{text:'全部',size:'medium',vertical:false});
const emit=defineEmits<{'update:modelValue':[value:T[]]}>();
const enabledValues=computed(()=>props.options.filter(item=>!item.disabled).map(item=>item.value));
const isAllChecked=computed(()=>enabledValues.value.length>0&&enabledValues.value.every(value=>props.modelValue.includes(value)));
const isIndeterminate=computed(()=>!isAllChecked.value&&enabledValues.value.some(value=>props.modelValue.includes(value)));
// 返回新数组，避免公共组件直接修改父组件传入的响应式数据。
const toggleItem=(checked:boolean,value:T)=>emit('update:modelValue',checked?Array.from(new Set([...props.modelValue,value])):props.modelValue.filter(item=>item!==value));
const toggleAll=(checked:boolean)=>{const disabledSelected=props.options.filter(item=>item.disabled&&props.modelValue.includes(item.value)).map(item=>item.value);emit('update:modelValue',checked?[...disabledSelected,...enabledValues.value]:disabledSelected)};
</script>
