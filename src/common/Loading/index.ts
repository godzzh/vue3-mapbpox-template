import { createVNode, defineComponent, h, reactive, render, type VNode } from 'vue';
import Loading from './index.vue';

export interface LoadingOptions {
    tip?: string | null;
    background?: string | null;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    absolute?: boolean;
}

export interface LoadingInstance {
    vm: VNode;
    close: () => void;
    open: (target: HTMLElement) => void;
    setTip: (tip?: string) => void;
    setLoading: (loading: boolean) => void;
    readonly loading: boolean;
    readonly $el: unknown;
}

export function createLoading(
    props: LoadingOptions,
    target?: HTMLElement,
    wait = false
): LoadingInstance {
    const data = reactive<LoadingOptions>({ loading: false, ...props });
    const host = document.createElement('div');

    const LoadingWrap = defineComponent({
        name: 'LoadingWrap',
        setup: () => () => h(Loading, { ...data }),
    });

    const vm = createVNode(LoadingWrap);
    const mount = () => render(vm, host);
    if (wait) window.setTimeout(mount, 0);
    else mount();

    const open = (nextTarget: HTMLElement) => {
        if (!vm.el) return;
        const position = window.getComputedStyle(nextTarget).position;
        if (!['fixed', 'sticky', 'relative', 'absolute'].includes(position)) {
            nextTarget.style.position = 'relative';
        }
        nextTarget.appendChild(vm.el as Node);
    };

    const close = () => {
        render(null, host);
        vm.el?.parentNode?.removeChild(vm.el);
    };

    if (target) open(target);

    return {
        vm,
        close,
        open,
        setTip: (tip = '') => {
            data.tip = tip;
        },
        setLoading: (loading) => {
            data.loading = loading;
        },
        get loading() {
            return Boolean(data.loading);
        },
        get $el() {
            return vm.el;
        },
    };
}
