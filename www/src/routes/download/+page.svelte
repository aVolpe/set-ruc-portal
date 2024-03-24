<script lang="ts">
    import { loadConfig } from "$lib/config";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import Download from "../../components/Download.svelte";

    const files: Writable<Array<{ text: string; url: string }>> = writable([]);

    onMount(() => {
        const config = loadConfig();

        const newFiles = [
            { text: "JSON", url: config.jsonDBFilePath },
            { text: "CSV", url: config.csvDBFilePath },
        ];
        files.set(newFiles);
    });
</script>

<div class="p-4 flex space-y-4 flex-col">
    <div class="text-white">
        <h1 class="text-3xl font-bold m-2">Descargar</h1>
        <h2>
            Obten los datos en formatos accesibles y procesables por una maquina
        </h2>
    </div>

    <ul>
        {#each $files as file (file.text)}
            <li>
                <a
                    href="/"
                    class="inline-flex text-white items-center font-medium hover:underline"
                >
                    <Download class="w-3.5 h-3.5 mr-1" />
                    {file.text}
                </a>
            </li>
        {/each}
    </ul>
</div>
