export default function logger(type, context, message) {

    if (import.meta.env.VITE_ENVIRONMENT === "dev") {
        switch (type) {
            case "info":
                console.info(`[INFO]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
                break;
            case "debug":
                console.debug(`[DEBUG]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
                break;
            case "error":
                console.error(`[ERROR]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
                break;
            default:
                console.log(`[LOG]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
        }
    }
}