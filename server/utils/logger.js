export default function logger(type, traceId, context, message) {

    switch (type) {
        case "info":
            console.info(`[INFO]-[TRACE-ID: ${traceId}]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
            break;
        case "debug":
            console.debug(`[DEBUG]-[TRACE-ID: ${traceId}]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
            break;
        case "warn":
            console.warn(`[WARN]-[TRACE-ID: ${traceId}]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
            break;
        case "error":
            console.error(`[ERROR]-[TRACE-ID: ${traceId}]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);
            break;
        default:
            console.log(`[LOG]-[TRACE-ID: ${traceId}]-[${new Date().toISOString()}]-[CONTEXT: ${context}]-[MESSAGE: ${message}]`);

    }
}