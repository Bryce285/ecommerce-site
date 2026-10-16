import type { ApiError } from './api-types';

// Every API response goes through these helpers so the JSON envelope and error
// format stay the same across routes.

export function json<T>(body: T, status = 200, headers: HeadersInit = {}): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
    });
}

export function apiError(status: number, code: string, message: string): Response {
    return json<ApiError>({ error: { code, message } }, status);
}

/** Fallback for HTTP methods a route does not implement. */
export function methodNotAllowed(...allowed: string[]): () => Response {
    return () => {
        const res = apiError(405, 'method_not_allowed', `Allowed methods: ${allowed.join(', ')}.`);
        res.headers.set('Allow', allowed.join(', '));
        return res;
    };
}
