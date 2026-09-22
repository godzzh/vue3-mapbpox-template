<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="darkTheme" :theme-overrides="themeOverrides">
        <n-global-style />
        <n-dialog-provider>
            <n-message-provider :duration="1500">
                <n-notification-provider>
                    <n-loading-bar-provider>
                        <GlobalApiBridge />
                        <App />
                    </n-loading-bar-provider>
                </n-notification-provider>
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, dateZhCN, type GlobalThemeOverrides, zhCN } from 'naive-ui';

import App from '@/App.vue';
import GlobalApiBridge from '@/layouts/GlobalApiBridge.vue';

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#36d9ff',
        primaryColorHover: '#78e8ff',
        primaryColorPressed: '#13bddd',
        primaryColorSuppl: '#36d9ff',
        borderRadius: '2px',
        bodyColor: '#060d24',
        cardColor: 'rgba(7, 15, 43, 0.96)',
        modalColor: 'rgba(7, 15, 43, 0.96)',
        popoverColor: 'rgba(7, 15, 43, 0.96)',
    },
    Message: {
        color: 'rgba(7, 15, 43, 0.96)',
    },
};
</script>
