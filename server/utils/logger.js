export default function logger(type, traceId, context, message) {

    const log = {
        level: type,
        traceId,
        context,
        message,
        timestamp: new Date().toISOString()
    };

    switch (type) {
        case "info":
            console.info(JSON.stringify(log));
            break;
        case "debug":
            console.debug(JSON.stringify(log));
            break;
        case "warn":
            console.warn(JSON.stringify(log));
            break;
        case "error":
            console.error(JSON.stringify(log));
            break;
        default:
            console.log(JSON.stringify(log));
    }
}