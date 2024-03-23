<script lang="ts">
    import { loadConfig } from "$lib/config";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import EmbeddedGist from "../../components/EmbeddedGist.svelte";

    const gists = [
        {
            lang: "java",
            gist: "aVolpe/fffbe6a9e9858c7e3546fb1d55782152",
            file: "SetUtils.java",
        },
        {
            lang: "javascript",
            gist: "aVolpe/fffbe6a9e9858c7e3546fb1d55782152",
            file: "DigitGenerator.js",
        },
    ];

    type GistInfo = {
        lang: string;
        gist: string;
        file: string;
    };
    const data: Writable<Array<GistInfo>> = writable(gists);
    const current: Writable<GistInfo> = writable(gists[1]);
</script>

<div class="p-4 flex space-y-4 flex-col">

    <div class="md:flex">
        <ul
            class="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0 pt-2"
        >
            {#each $data as snippet (snippet.lang)}
                <li>
                    <button type="button"
                        on:click={() => ($current = snippet)}
                        class={snippet.lang === $current.lang
                            ? "inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600"
                            : "inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"}
                        >{snippet.lang}
                    </button>
                </li>
            {/each}
        </ul>

        <div
            class="p-2 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-700 rounded-lg w-full"
        >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {$current.lang}
            </h3>
            <div class="mb-2">
                {#each $data as snippet (snippet.lang)}
                    <div class={
                        snippet.lang === $current.lang
                            ? "block"
                            : "hidden"
                    }>
                        <EmbeddedGist gist={snippet.gist} file={snippet.file} />
                    </div>
                {/each}
                </div>
        </div>
    </div>
</div>
