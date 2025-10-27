import { getUserDetailsByEmail } from '../services/user.service.js';

export async function getUserDetails(email, res) {

    try {
        const userInfo = await getUserDetailsByEmail(email);
        res.writeHead(200, { 'Content-Type': 'application/json', });
        res.end(JSON.stringify(userInfo));
    } catch (error) {
        console.error(`Failed to get user details: [${error}]`);
        const statusCode = error.statusCode || 500;
        const errorMessage = error.errorMessage || 'Internal server error';

        res.writeHead(statusCode, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(errorMessage));
    }
} 