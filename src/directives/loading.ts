import { isRef, type App, type Directive, type DirectiveBinding, type Ref } from 'vue';

import { createLoading, type LoadingInstance } from '@/common/Loading';

type LoadingElement = HTMLElement & { __loadingInstance?: LoadingInstance };
type LoadingValue = boolean | Ref<boolean>;

const resolveLoading = (value: LoadingValue | null | undefined) =>
    Boolean(isRef(value) ? value.value : value);

const resolveSize = (value: string | null): 'small' | 'medium' | 'large' =>
    value === 'small' || value === 'large' ? value : 'medium';

/** 支持 boolean / Ref<boolean>，添加 fullscreen 修饰符可挂载到 body。 */
const loadingDirective: Directive<LoadingElement, LoadingValue> = {
    mounted(el, binding: DirectiveBinding<LoadingValue>) {
        const fullscreen = Boolean(binding.modifiers.fullscreen);
        el.__loadingInstance = createLoading(
            {
                tip: el.getAttribute('loading-tip'),
                background: el.getAttribute('loading-background'),
                size: resolveSize(el.getAttribute('loading-size')),
                loading: resolveLoading(binding.value),
                absolute: !fullscreen,
            },
            fullscreen ? document.body : el,
        );
    },
    updated(el, binding) {
        if (resolveLoading(binding.oldValue) !== resolveLoading(binding.value)) {
            el.__loadingInstance?.setLoading(resolveLoading(binding.value));
        }
    },
    unmounted(el) {
        el.__loadingInstance?.close();
        delete el.__loadingInstance;
    },
};

export function setupLoadingDirective(app: App) {
    app.directive('loading', loadingDirective);
}

export default loadingDirective;
