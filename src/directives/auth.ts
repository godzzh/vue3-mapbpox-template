import type { App, Directive, DirectiveBinding } from 'vue';

/**
 * v-auth 按钮权限指令。
 * - v-auth="'btn:add'" 或 v-auth="['btn:add', 'btn:edit']"，任一命中即通过。
 * - 权限列表由用户信息加载后调用 setAuthList() 注入；`*` 表示管理员通配权限。
 */
let authList: string[] = [];

export function setAuthList(list: string[]) {
    authList = [...list];
}

export function getAuthList(): string[] {
    return [...authList];
}

const hasPermission = (value?: string | string[]) => {
    if (!value) return true;
    if (authList.includes('*')) return true;
    const required = Array.isArray(value) ? value : [value];
    return required.some((code) => authList.includes(code));
};

const removeUnauthorizedElement = (
    el: HTMLElement,
    binding: DirectiveBinding<string | string[]>,
) => {
    if (!hasPermission(binding.value)) el.remove();
};

const authDirective: Directive<HTMLElement, string | string[]> = {
    mounted: removeUnauthorizedElement,
};

export function setupPermissionDirective(app: App) {
    app.directive('auth', authDirective);
}

export default authDirective;
