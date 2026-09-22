import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import Provider from '@/layouts/Provider.vue';
import router from '@/router';
import services from '@/services';
import { GlobalKey } from '@/types/injection-keys';
import emitter from '@/utils/emitter';

import 'vfonts/FiraSans.css';
import 'vfonts/FiraCode.css';
import '@/styles/global.less';

dayjs.locale('zh-cn');

const app = createApp(Provider);
app.use(createPinia());
app.use(router);
app.provide(GlobalKey, {
    $api: services,
    $dayjs: dayjs,
    $emitter: emitter,
});
app.mount('#app');
