import type { App, Directive, DirectiveBinding } from 'vue';

interface RippleOptions {
    color?: string;
    /** 动画时长（ms），默认 400。 */
    duration?: number;
}

type RippleElement = HTMLElement & { __rippleHandler?: (event: PointerEvent) => void };

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

const getMaxRadius = (x: number, y: number, width: number, height: number) =>
    Math.max(
        getDistance(x, y, 0, 0),
        getDistance(x, y, width, 0),
        getDistance(x, y, 0, height),
        getDistance(x, y, width, height),
    );

/** v-ripple 或 v-ripple="{ color: '#2563eb', duration: 400 }"。 */
const rippleDirective: Directive<RippleElement, RippleOptions | undefined> = {
    mounted(el, binding: DirectiveBinding<RippleOptions | undefined>) {
        const handler = (event: PointerEvent) => {
            const options = binding.value || {};
            const duration = Number(options.duration) || 400;
            if (!['fixed', 'sticky'].includes(el.style.position)) el.style.position = 'relative';
            el.style.overflow = 'hidden';

            const rect = el.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const diameter = getMaxRadius(x, y, rect.width, rect.height) * 2;
            const ripple = document.createElement('span');
            Object.assign(ripple.style, {
                position: 'absolute',
                pointerEvents: 'none',
                background: options.color || 'var(--primary-color, #36d9ff)',
                borderRadius: '50%',
                width: `${diameter}px`,
                height: `${diameter}px`,
                left: `${x - diameter / 2}px`,
                top: `${y - diameter / 2}px`,
                transform: 'scale(0)',
            });
            el.appendChild(ripple);

            const animation = ripple.animate(
                [
                    { transform: 'scale(0)', opacity: 0.45 },
                    { transform: 'scale(1)', opacity: 0 },
                ],
                { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            );
            const remove = () => ripple.remove();
            animation.onfinish = remove;
            animation.oncancel = remove;
        };

        el.addEventListener('pointerdown', handler);
        el.__rippleHandler = handler;
    },
    unmounted(el) {
        if (el.__rippleHandler) {
            el.removeEventListener('pointerdown', el.__rippleHandler);
            delete el.__rippleHandler;
        }
    },
};

export function setupRippleDirective(app: App) {
    app.directive('ripple', rippleDirective);
}

export default rippleDirective;
