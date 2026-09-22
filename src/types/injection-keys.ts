import type dayjs from 'dayjs';
import type { Emitter } from 'mitt';
import type { InjectionKey } from 'vue';

import type { AppEvents } from '@/utils/emitter';

export type ApiMethod = (...args: unknown[]) => Promise<unknown>;
export type ApiService = Record<string, ApiMethod>;

export interface GlobalInjection {
    $api: ApiService;
    $dayjs: typeof dayjs;
    $emitter: Emitter<AppEvents>;
}

export const GlobalKey: InjectionKey<GlobalInjection> = Symbol('global');
