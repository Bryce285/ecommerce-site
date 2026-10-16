/** Formats an amount in cents */
export function formatPrice(cents: number, currency: string): string {
    if (cents === 0) return 'Free';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}
