import { registerRoute } from './router.manager.js';
import {getUserDetails} from '../controllers/user.controller.js'

registerRoute('GET', '/api/v1/user/:email', async (req, res, params) => {
    const { email } = params;
    await getUserDetails(email, res);
});