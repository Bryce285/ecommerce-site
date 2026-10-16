// Response and request shapes for the /api/v1 REST API. Shared by the route
// handlers and the pages that call them, so the two cannot drift apart.

export interface Product {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    priceCents: number; // price in cents to avoid float rounding
    currency: string;
    features: string[];
    technicalDetails: string[];
}

export interface Order {
    id: string;
    productSlug: string;
    quantity: number;
    totalCents: number;
    currency: string;
    email: string;
    status: 'pending';
    createdAt: string;
}

export interface CreateOrderRequest {
    productSlug: string;
    quantity?: number;
    email: string;
}

export interface ItemResponse<T> {
    data: T;
}

export interface ListResponse<T> {
    data: T[];
}

export interface ApiError {
    error: { code: string; message: string };
}

export interface HealthStatus {
    status: 'ok';
    version: 'v1';
    time: string;
}
