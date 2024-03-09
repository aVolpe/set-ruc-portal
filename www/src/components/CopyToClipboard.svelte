<script>
    import CopyButton from './CopyOutlined.svelte';
    export let text = '';
    export let title = 'Copiar al portapapeles';

    function copyToClipboard() {
        navigator.clipboard.writeText(text);
    }
</script>

<button on:click={copyToClipboard} title={title}>
    <CopyButton />
</button>