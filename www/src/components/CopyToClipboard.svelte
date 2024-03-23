<script>
    import { writable } from "svelte/store";
    import CopyButton from "./CopyOutlined.svelte";
    import Check from "./Check.svelte";
    export let text = "";
    export let title = "Copiar al portapapeles";

    const copied = writable(false);

    function copyToClipboard() {
        copied.set(true);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            copied.set(false);
        }, 1000);
    }
</script>

<button
    on:click={copyToClipboard}
    title={$copied ? "Copiado!" : title}
    class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
>
    {#if $copied}
        <Check class="w-3.5 h-3.5  text-blue-700 dark:text-blue-500"/>
    {:else}
        <CopyButton class="w-3.5 h-3.5"/>
    {/if}
</button>
