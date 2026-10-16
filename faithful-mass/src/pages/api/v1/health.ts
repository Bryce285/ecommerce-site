import type { APIRoute } from 'astro';
import { json, methodNotAllowed } from '../../../lib/api';
import type { HealthStatus } from '../../../lib/api-types';

export const prerender = false;

export const GET: APIRoute = () =>
    json<HealthStatus>(
        { status: 'ok', version: 'v1', time: new Date().toISOString() },
        200,
        { 'Cache-Control': 'no-store' },
    );

export const ALL: APIRoute = methodNotAllowed('GET');
