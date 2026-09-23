import type { App } from 'vue';

import { setupPermissionDirective } from './auth';
import { setupDragDirective } from './drag';
import { setupLoadingDirective } from './loading';
import { setupRippleDirective } from './ripple';

export function setupGlobDirectives(app: App) {
    setupLoadingDirective(app);
    setupPermissionDirective(app);
    setupDragDirective(app);
    setupRippleDirective(app);
}
