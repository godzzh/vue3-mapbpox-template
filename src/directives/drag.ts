import type { App, Directive, DirectiveBinding } from 'vue';

import Drag, { type DragStyleOptions } from '@/utils/drag';

type DragElement = HTMLElement & { __dragInstance?: Drag };

const dragDirective: Directive<DragElement, DragStyleOptions | undefined> = {
    mounted(el, binding: DirectiveBinding<DragStyleOptions | undefined>) {
        el.__dragInstance = new Drag(el, binding.value || {});
    },
    unmounted(el) {
        el.__dragInstance?.destroy();
        delete el.__dragInstance;
    },
};

export function setupDragDirective(app: App) {
    app.directive('drag', dragDirective);
}

export default dragDirective;
