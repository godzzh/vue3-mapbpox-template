<template>
    <SidePanel v-model:expanded="screenStore.leftExpanded" side="left">
        <HomePanelContent />
    </SidePanel>
</template>

<script setup lang="ts">
import HomePanelContent from '@/components/dashboard/HomePanelContent.vue';
import SidePanel from '@/components/screen/SidePanel.vue';
import { useScreenStore } from '@/stores/screen';

const screenStore = useScreenStore();
</script>
