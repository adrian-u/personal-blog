import { retrieveAbout } from "../services/about.service.js";

export async function getAbout(res) {

    try {
        const aboutData = await retrieveAbout();
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(aboutData));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || 'Internal server error';
        console.error(`Internal error while retrieving about data: [${errorMessage}]`);

        res.writeHead(statusCode, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ error: errorMessage }));
    }
}