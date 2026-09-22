/// <reference types="vite/client" />

import type { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui';

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    interface Window {
        $message?: MessageApi;
        $dialog?: DialogApi;
        $notification?: NotificationApi;
        $loadingBar?: LoadingBarApi;
    }
}

export {};
