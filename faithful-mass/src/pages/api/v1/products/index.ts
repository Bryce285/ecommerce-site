import type { APIRoute } from 'astro';
import { json, methodNotAllowed } from '../../../../lib/api';
import type { ListResponse, Product } from '../../../../lib/api-types';
import { products } from '../../../../lib/mock-data';

export const prerender = false;

export const GET: APIRoute = () =>
    json<ListResponse<Product>>({ data: products });

export const ALL: APIRoute = methodNotAllowed('GET');
