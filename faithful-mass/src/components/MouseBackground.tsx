import { useEffect, useRef } from 'react';

interface Props {
    /** Dot colour, as any CSS colour string. */
    color?: string;
    /** Distance between dots, in CSS pixels. */
    spacing?: number;
    /** How far from the pointer dots are affected, in CSS pixels. */
    radius?: number;
}

interface Dot {
    // Resting position.
    ox: number;
    oy: number;
    // Current displacement from the resting position, and its velocity.
    dx: number;
    dy: number;
    vx: number;
    vy: number;
}

const SPRING = 0.08;
const DAMPING = 0.82;
const PUSH = 40;

/**
 * A grid of dots that is pushed away from, and lit up near, the pointer. Fills
 * its (positioned) parent and ignores pointer events, so content stacked above
 * it stays clickable and selectable.
 */
export default function MouseBackground({
    color = '#00A5CF',
    spacing = 32,
    radius = 160,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        let dots: Dot[] = [];
        let width = 0;
        let height = 0;
        let frame = 0;
        let visible = true;
        // Pointer position in canvas coordinates; null while it is away.
        let pointer: { x: number; y: number } | null = null;
        // Smoothed copy that trails the pointer, so motion eases rather than snaps.
        let smooth = { x: 0, y: 0 };

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            dots = [];
            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;
            const offsetX = (width - (cols - 1) * spacing) / 2;
            const offsetY = (height - (rows - 1) * spacing) / 2;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    dots.push({
                        ox: offsetX + c * spacing,
                        oy: offsetY + r * spacing,
                        dx: 0, dy: 0, vx: 0, vy: 0,
                    });
                }
            }
            draw();
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = color;
            for (const d of dots) {
                const x = d.ox + d.dx;
                const y = d.oy + d.dy;
                let glow = 0;
                if (pointer) {
                    const dist = Math.hypot(x - smooth.x, y - smooth.y);
                    glow = Math.max(0, 1 - dist / radius);
                }
                ctx.globalAlpha = 0.3 + glow * 0.7;
                ctx.beginPath();
                ctx.arc(x, y, 1.2 + glow * 2.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        function step() {
            if (pointer) {
                smooth.x += (pointer.x - smooth.x) * 0.2;
                smooth.y += (pointer.y - smooth.y) * 0.2;
            }
            for (const d of dots) {
                if (pointer) {
                    const x = d.ox - smooth.x;
                    const y = d.oy - smooth.y;
                    const dist = Math.hypot(x, y);
                    if (dist < radius && dist > 0.01) {
                        const force = (1 - dist / radius) ** 2 * PUSH;
                        // Aim for a displaced rest point away from the pointer.
                        d.vx += ((x / dist) * force - d.dx) * SPRING;
                        d.vy += ((y / dist) * force - d.dy) * SPRING;
                    } else {
                        d.vx -= d.dx * SPRING;
                        d.vy -= d.dy * SPRING;
                    }
                } else {
                    d.vx -= d.dx * SPRING;
                    d.vy -= d.dy * SPRING;
                }
                d.vx *= DAMPING;
                d.vy *= DAMPING;
                d.dx += d.vx;
                d.dy += d.vy;
            }
        }

        function loop() {
            step();
            draw();
            frame = requestAnimationFrame(loop);
        }

        function start() {
            if (!frame && visible && !reducedMotion.matches) frame = requestAnimationFrame(loop);
        }

        function stop() {
            cancelAnimationFrame(frame);
            frame = 0;
        }

        function onPointerMove(e: PointerEvent) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
            if (!inside) {
                pointer = null;
                return;
            }
            if (!pointer) smooth = { x, y };
            pointer = { x, y };
        }

        const onPointerLeave = () => { pointer = null; };

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start(); else stop();
        });
        observer.observe(canvas);

        const onMotionChange = () => {
            if (reducedMotion.matches) {
                stop();
                pointer = null;
                for (const d of dots) { d.dx = d.dy = d.vx = d.vy = 0; }
                draw();
            } else {
                start();
            }
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        // Listen on the window: the canvas itself has pointer-events: none.
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerLeave);
        reducedMotion.addEventListener('change', onMotionChange);

        resize();
        start();

        return () => {
            stop();
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            document.documentElement.removeEventListener('pointerleave', onPointerLeave);
            reducedMotion.removeEventListener('change', onMotionChange);
        };
    }, [color, spacing, radius]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    );
}
