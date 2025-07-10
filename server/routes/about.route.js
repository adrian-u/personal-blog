import { getAbout } from "../controllers/about.controller.js";
import { registerRoute } from './router.manager.js';

registerRoute('GET', '/api/v1/about', async (req, res) => {
    await getAbout(res);
});