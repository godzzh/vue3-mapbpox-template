import type { ApiMethod } from '@/types/injection-keys';

const modules = import.meta.glob('./*.ts', { eager: true }) as Record<string, Record<string, unknown>>;
const api: Record<string, unknown> = {};

for (const [path, module] of Object.entries(modules)) {
    if (path.endsWith('/index.ts')) continue;
    for (const [name, member] of Object.entries(module)) {
        if (name === 'default') continue;
        if (import.meta.env.DEV && name in api) {
            console.warn(`[services] 接口名重复，后注册的将覆盖前者: ${name} (${path})`);
        }
        api[name] = member;
    }
}

export default api as Record<string, ApiMethod>;
