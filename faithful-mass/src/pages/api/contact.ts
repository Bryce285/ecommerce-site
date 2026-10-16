import type { APIRoute } from 'astro';
import {
    RESEND_API_KEY, TURNSTILE_SECRET_KEY, CONTACT_TO_EMAIL,
} from 'astro:env/server';

export const prerender = false;

const MAX_EMAIL = 200;
const MAX_NAME = 100;
const MAX_MESSAGE = 5000;

// Placeholder. Deliberately permissive
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return new Response('Expected form data', { status: 400 });
    }

    const isSupport = form.get('topic') === 'support';

    const fail = (code: string) =>
        redirect(`${isSupport ? '/support' : '/contact'}?error=${code}`, 303);

    if (form.get('website')) return redirect('/thanks', 303);

    let success = false;
    try {
        const verify = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: TURNSTILE_SECRET_KEY,
                    response: String(form.get('cf-turnstile-response') ?? ''),
                    remoteip: clientAddress,
                }),
            },
        );
        ({ success } = (await verify.json()) as { success: boolean });
    } catch {
        return fail('captcha');
    }
    if (!success) return fail('captcha');

    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    if (email.length > MAX_EMAIL || !EMAIL_PATTERN.test(email) || !message) {
        return fail('fields');
    }

    const name = [form.get('first_name'), form.get('last_name')]
        .filter(Boolean).join(' ').slice(0, MAX_NAME);
    const topic = isSupport ? 'Support request' : 'Contact';

    // dev stub to test form submission without an API key
    if (import.meta.env.DEV || !RESEND_API_KEY.startsWith('re_')) {
        console.log('[contact] would send:', { topic, name, email, message });
        return redirect('/thanks', 303);
    }

    let sent: Response;
    try {
        sent = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Company Name <forms@yourdomain.com>',
                to: [CONTACT_TO_EMAIL],
                reply_to: email,
                subject: `${topic} from ${name || email}`,
                text: `From: ${name || '(no name)'} <${email}>\n\n${message.slice(0, MAX_MESSAGE)}`,
            }),
        });
    } catch {
        return fail('send');
    }

    if (!sent.ok) return fail('send');
    return redirect('/thanks', 303);
};
