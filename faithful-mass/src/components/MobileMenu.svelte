<script lang="ts">
    import { MediaQuery } from 'svelte/reactivity';

    let { products }: { products: { slug: string; name: string }[] } = $props();

    let open = $state(false);
    let toggleEl: HTMLButtonElement;
    let menuEl: HTMLDivElement;

    // Close the menu when the viewport grows into the desktop layout.
    const desktop = new MediaQuery('min-width: 850px');
    $effect(() => {
        if (desktop.current) open = false;
    });

    function onDocumentClick(event: MouseEvent) {
        const target = event.target as Node;
        if (!toggleEl.contains(target) && !menuEl.contains(target)) open = false;
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') open = false;
    }
</script>

<svelte:document onclick={onDocumentClick} onkeydown={onKeydown} />

<button
    bind:this={toggleEl}
    onclick={() => (open = !open)}
    type="button"
    aria-expanded={open}
    aria-controls="popout-menu"
    aria-label="Toggle menu"
    class="hidden max-[850px]:flex ml-10 flex-col justify-center gap-1.5 cursor-pointer z-10"
>
    <span class={['block w-6 h-0.5 bg-white transition-all duration-200 ease-out', open && 'rotate-45 translate-y-2']}></span>
    <span class={['block w-6 h-0.5 bg-white transition-all duration-200 ease-out', open && 'opacity-0']}></span>
    <span class={['block w-6 h-0.5 bg-white transition-all duration-200 ease-out', open && '-rotate-45 -translate-y-2']}></span>
</button>

<div
    bind:this={menuEl}
    id="popout-menu"
    class={[
        'flex flex-col items-center fixed left-0 right-0 top-25 bottom-0 z-40 bg-black border-t border-gray-600 overflow-y-auto transition-all duration-200 ease-out',
        !open && 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
    ]}
>
    <a href="/products" class="m-4 text-lg text-center hover:text-gray-300">Products</a>
    {#each products as product (product.slug)}
        <a href="/products/{product.slug}" class="mx-4 mb-4 text-center hover:text-gray-300">{product.name}</a>
    {/each}
    <a href="/about" class="m-4 text-lg text-center hover:text-gray-300">About</a>
    <a href="/faq" class="m-4 text-lg text-center hover:text-gray-300">Support/FAQ</a>
</div>
