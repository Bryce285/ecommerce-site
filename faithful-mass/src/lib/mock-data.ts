// Placeholder data
import type { Product } from './api-types';

const features = [
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    'Aenean commodo ligula eget dolor. Aenean massa.',
    'Cum sociis natoque penatibus et magnis dis parturient montes.',
    'Nulla consequat massa quis enim.',
    'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.',
];

const technicalDetails = [
    'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.',
    'Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.',
    'Nullam dictum felis eu pede mollis pretium.',
    'Integer tincidunt. Cras dapibus.',
];

export const products: Product[] = [
    {
        slug: 'product-name',
        name: 'Product Name',
        tagline: 'A short product tagline goes here.',
        description: 'A longer description of Product Name and what it does.',
        priceCents: 0,
        currency: 'USD',
        features,
        technicalDetails,
    },
    {
        slug: 'second-product',
        name: 'Second Product',
        tagline: 'Another short tagline goes here.',
        description: 'A longer description of Second Product and what it does.',
        priceCents: 4900,
        currency: 'USD',
        features,
        technicalDetails,
    },
    {
        slug: 'third-product',
        name: 'Third Product',
        tagline: 'One more short tagline goes here.',
        description: 'A longer description of Third Product and what it does.',
        priceCents: 9900,
        currency: 'USD',
        features,
        technicalDetails,
    },
];

export function findProduct(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}
