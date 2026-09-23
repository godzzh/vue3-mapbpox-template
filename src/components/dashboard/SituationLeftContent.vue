<template>
    <PanelSection title="隐患总览">
        <section class="hazard-overview relative overflow-hidden border-y border-[rgba(82,174,207,0.16)]" aria-label="隐患治理概况">
            <div class="relative grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 px-3.5 pb-3 pt-3.5">
                <div class="grid min-w-0 gap-1">
                    <span class="text-xs tracking-[0.1em] text-sky-100/55">辖区风险隐患存量</span>
                    <span class="flex items-baseline gap-1.5">
                        <strong class="font-vfonts text-[34px] font-semibold leading-none tracking-[-0.05em] text-[#8de9f7] [font-variant-numeric:tabular-nums] [text-shadow:0_0_16px_rgba(54,217,255,0.17)]">{{ totalHazards.value.toLocaleString() }}</strong>
                        <small class="text-xs text-sky-100/45">{{ totalHazards.unit }}</small>
                    </span>
                </div>
                <div class="grid justify-items-end gap-0.5 pb-0.5">
                    <span class="text-xs tracking-[0.08em] text-sky-100/45">整改率</span>
                    <span class="flex items-baseline">
                        <strong class="font-vfonts text-[27px] font-semibold leading-none text-[#e8fbff] [font-variant-numeric:tabular-nums]">{{ rectificationRate.value }}</strong>
                        <small class="ml-0.5 text-xs text-[#75ddeb]">%</small>
                    </span>
                </div>
            </div>
            <div class="relative px-3.5 pb-3">
                <div class="mb-1.5 flex items-center justify-between text-[10px] text-sky-100/35">
                    <span>整改进度</span>
                    <span class="font-vfonts [font-variant-numeric:tabular-nums]">{{ rectifiedHazards.value.toLocaleString() }} / {{ totalHazards.value.toLocaleString() }}</span>
                </div>
                <div class="hazard-progress-track relative h-1.5 overflow-hidden bg-sky-950/70">
                    <i class="hazard-progress-fill block h-full" :style="{ width: `${rectificationRate.value}%` }" />
                </div>
            </div>
            <div class="relative grid grid-cols-2 border-t border-sky-200/10">
                <article class="grid min-h-[54px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5">
                    <span class="grid min-w-0 gap-0.5">
                        <span class="whitespace-nowrap text-xs text-sky-50/70">今日新增</span>
                        <small class="truncate text-[10px] text-sky-100/30">实时汇入隐患</small>
                    </span>
                    <strong class="whitespace-nowrap font-vfonts text-lg font-medium text-[#f1c278] [font-variant-numeric:tabular-nums]">+{{ todayAdded.value }}<small class="ml-1 font-sans text-[10px] font-normal text-sky-100/40">{{ todayAdded.unit }}</small></strong>
                </article>
                <article class="grid min-h-[54px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l border-sky-200/10 px-3.5 py-2.5">
                    <span class="grid min-w-0 gap-0.5">
                        <span class="whitespace-nowrap text-xs text-sky-50/70">累计整改</span>
                        <small class="truncate text-[10px] text-sky-100/30">闭环处置完成</small>
                    </span>
                    <strong class="whitespace-nowrap font-vfonts text-lg font-medium text-[#83e7c2] [font-variant-numeric:tabular-nums]">{{ rectifiedHazards.value.toLocaleString() }}<small class="ml-1 font-sans text-[10px] font-normal text-sky-100/40">{{ rectifiedHazards.unit }}</small></strong>
                </article>
            </div>
        </section>
    </PanelSection>
    <PanelSection title="隐患分类">
        <div class="h-[132px] w-full" role="img" aria-label="隐患分类横向条形图"><VEcharts :options="categoryOptions" /></div>
    </PanelSection>
    <PanelSection title="预警趋势">
        <div class="h-[154px] w-full" role="img" aria-label="近12小时预警趋势折线图"><VEcharts :options="trendOptions" /></div>
    </PanelSection>
</template>
<script setup lang="ts">
import * as echarts from 'echarts/core';
import VEcharts from '@/common/VEcharts/index.vue';
import PanelSection from '@/components/screen/PanelSection.vue';
import { hazardCategories, hazardOverview, warningTrend } from '@/config/dashboard';

const [totalHazards, todayAdded, rectifiedHazards, rectificationRate] = hazardOverview;
if (!totalHazards || !todayAdded || !rectifiedHazards || !rectificationRate) {
    throw new Error('隐患总览配置不完整');
}

const axisText = { color: 'rgba(226,244,252,.72)', fontSize: 12 };
const tooltip = { trigger: 'axis', backgroundColor: 'rgba(4,20,43,.94)', borderColor: 'rgba(91,192,224,.46)', textStyle: { color: '#eafaff', fontSize: 12 } };
const categoryOptions = {
    animationDuration: 700, grid: { left:4,right:4,top:2,bottom:2 }, tooltip: { ...tooltip, axisPointer:{ type:'shadow' } },
    xAxis: { type:'value',show:false,max:450 },
    yAxis: { type:'category',inverse:true,data:hazardCategories.map(item=>item.name),axisLine:{show:false},axisTick:{show:false},axisLabel:axisText },
    series: [{ type:'bar',data:hazardCategories.map(item=>item.value),barWidth:8,showBackground:true,backgroundStyle:{color:'rgba(33,75,111,.48)',borderRadius:4},label:{show:true,position:'right',color:'#9ce8f6',fontSize:12},itemStyle:{borderRadius:4,color:new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#2388bf'},{offset:1,color:'#70e0f2'}])} }],
};
const trendOptions = {
    animationDuration:700, grid:{left:4,right:4,top:2,bottom:2}, tooltip,
    xAxis:{type:'category',boundaryGap:false,data:['01','02','03','04','05','06','07','08','09','10','11','12'],axisLine:{lineStyle:{color:'rgba(78,157,193,.28)'}},axisTick:{show:false},axisLabel:{...axisText,interval:2,formatter:'{value}时'}},
    yAxis:{type:'value',splitNumber:3,axisLine:{show:false},axisTick:{show:false},axisLabel:axisText,splitLine:{lineStyle:{color:'rgba(72,142,177,.12)'}}},
    series:[{type:'line',data:warningTrend,smooth:.35,symbol:'circle',symbolSize:5,lineStyle:{width:2,color:'#67dced'},itemStyle:{color:'#9ceef9',borderColor:'#176a95',borderWidth:1},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(65,194,224,.38)'},{offset:1,color:'rgba(26,93,139,.02)'}])}}],
};
</script>
<style scoped>
.hazard-overview {
    background:radial-gradient(circle at 80% 5%,rgba(53,190,218,.1),transparent 36%),linear-gradient(120deg,rgba(15,61,94,.34),rgba(5,28,54,.12));
}
.hazard-overview::before {
    content:'';
    position:absolute;
    inset:0;
    pointer-events:none;
    opacity:.1;
    background:repeating-linear-gradient(90deg,transparent 0 31px,rgba(125,218,238,.16) 31px 32px);
}
.hazard-progress-track::after {
    content:'';
    position:absolute;
    inset:0;
    background:repeating-linear-gradient(90deg,transparent 0 24px,rgba(5,27,51,.72) 24px 25px);
}
.hazard-progress-fill {
    background:linear-gradient(90deg,#268ebe,#72e1f4);
    box-shadow:0 0 8px rgba(75,209,239,.28);
}
</style>
