import DOMPurify from 'isomorphic-dompurify';

export function sanitizeContent(content) {
    if (!content || typeof content !== 'string') {
        return content;
    }

    const sanitized = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'code', 'pre'],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
    });

    return sanitized.trim();
}
