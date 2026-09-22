<template>
    <SidePanel v-model:expanded="screenStore.leftExpanded" side="left">
        <SituationLeftContent />
    </SidePanel>

    <SidePanel v-model:expanded="screenStore.rightExpanded" side="right">
        <SituationRightContent />
    </SidePanel>
</template>

<script setup lang="ts">
import SituationLeftContent from '@/components/dashboard/SituationLeftContent.vue';
import SituationRightContent from '@/components/dashboard/SituationRightContent.vue';
import SidePanel from '@/components/screen/SidePanel.vue';
import { useScreenStore } from '@/stores/screen';

const screenStore = useScreenStore();
</script>
