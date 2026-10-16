import type { APIRoute } from 'astro';
import { apiError, json, methodNotAllowed } from '../../../../lib/api';
import type { ItemResponse, Product } from '../../../../lib/api-types';
import { findProduct } from '../../../../lib/mock-data';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
    const product = findProduct(params.slug ?? '');
    if (!product) return apiError(404, 'product_not_found', 'No product with that slug.');
    return json<ItemResponse<Product>>({ data: product });
};

export const ALL: APIRoute = methodNotAllowed('GET');
