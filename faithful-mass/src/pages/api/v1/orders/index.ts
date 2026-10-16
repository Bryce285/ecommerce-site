import type { APIRoute } from 'astro';
import { apiError, json, methodNotAllowed } from '../../../../lib/api';
import type { CreateOrderRequest, ItemResponse, Order } from '../../../../lib/api-types';
import { findProduct } from '../../../../lib/mock-data';

export const prerender = false;

const MAX_QUANTITY = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Placeholder
export const POST: APIRoute = async ({ request }) => {
    let body: Partial<CreateOrderRequest>;
    try {
        body = await request.json();
    } catch {
        return apiError(400, 'invalid_json', 'Request body must be valid JSON.');
    }
    if (typeof body !== 'object' || body === null) {
        return apiError(400, 'invalid_json', 'Request body must be a JSON object.');
    }

    const product = findProduct(String(body.productSlug ?? ''));
    if (!product) return apiError(404, 'product_not_found', 'No product with that slug.');

    const quantity = body.quantity ?? 1;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return apiError(422, 'invalid_quantity', `Quantity must be a whole number from 1 to ${MAX_QUANTITY}.`);
    }

    const email = String(body.email ?? '').trim();
    if (email.length > 200 || !EMAIL_PATTERN.test(email)) {
        return apiError(422, 'invalid_email', 'A valid email address is required.');
    }

    const order: Order = {
        id: `ord_${crypto.randomUUID().slice(0, 8)}`,
        productSlug: product.slug,
        quantity,
        totalCents: product.priceCents * quantity,
        currency: product.currency,
        email,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    return json<ItemResponse<Order>>({ data: order }, 201, { 'Cache-Control': 'no-store' });
};

export const ALL: APIRoute = methodNotAllowed('POST');
