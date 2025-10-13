export function isEmpty(value) {
    if (_isString(value)) return !value.trim().length;
    if (Array.isArray(value)) return value.length === 0;
    return value == null;
}

function _isString(value) {
    return typeof value === "string" || value instanceof String;
}