import { tryInitialRefresh } from './js/auth/auth.js';
import { setupRouting } from './js/router/router.js';

(async () => {
    await tryInitialRefresh();
    await setupRouting();
})();
