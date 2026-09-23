export type DragStyleOptions = Partial<Pick<CSSStyleDeclaration,
    'left' | 'top' | 'right' | 'bottom' | 'position' | 'transform'
>>;

/** 通过指定拖拽手柄移动其父元素，并把活动范围限制在当前视口。 */
class Drag {
    private readonly handle: HTMLElement;
    private readonly target: HTMLElement;

    constructor(handle: HTMLElement, options: DragStyleOptions = {}) {
        if (!(handle.parentElement instanceof HTMLElement)) {
            throw new Error('v-drag 必须挂载在具有 HTMLElement 父节点的拖拽手柄上');
        }
        this.handle = handle;
        this.target = handle.parentElement;
        this.handle.style.cursor = 'move';
        Object.assign(this.target.style, options);
        this.handle.addEventListener('pointerdown', this.handlePointerDown);
    }

    destroy() {
        this.handle.removeEventListener('pointerdown', this.handlePointerDown);
    }

    private readonly handlePointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const startRect = this.target.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        this.target.style.right = 'auto';
        this.target.style.bottom = 'auto';
        this.target.style.transform = 'none';
        this.target.style.position ||= 'fixed';

        const handleMove = (moveEvent: PointerEvent) => {
            const maxLeft = Math.max(0, window.innerWidth - startRect.width);
            const maxTop = Math.max(0, window.innerHeight - startRect.height);
            const left = Math.min(maxLeft, Math.max(0, startRect.left + moveEvent.clientX - startX));
            const top = Math.min(maxTop, Math.max(0, startRect.top + moveEvent.clientY - startY));
            this.target.style.left = `${left}px`;
            this.target.style.top = `${top}px`;
        };
        const handleUp = () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
            window.removeEventListener('pointercancel', handleUp);
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp, { once: true });
        window.addEventListener('pointercancel', handleUp, { once: true });
    };
}

export default Drag;
