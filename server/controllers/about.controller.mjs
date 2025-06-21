import retrieveAbout from "../services/about.service.mjs";

export function getAbout(res) {
    
    const aboutData = retrieveAbout();

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(aboutData));
}