<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import CopyToClipboard from "../components/CopyToClipboard.svelte";
    import { loadConfig } from "$lib/config";
    import Loading from "../components/Loading.svelte";

    type RUCResult = {
        ruc: string;
        name: string;
        dv: string;
    };

    type Async<T> =
        | { state: "NO_REQUESTED" }
        | { state: "FETCHING", value: T }
        | { state: "ERROR"; error: Error }
        | { state: "DONE"; value: T };

    let inputElement: HTMLInputElement;
    let searchQuery: string = "";
    let results: Async<Array<RUCResult>> = { state: "NO_REQUESTED" };
    let recentSearches: Writable<RUCResult[]> = writable([]);
    let currentPage: number = 1;
    let lastQuery = "";

    onMount(() => {
        recentSearches.set(
            JSON.parse(localStorage?.getItem("recentSearches") || "[]"),
        );
        recentSearches.subscribe((value) => {
            localStorage?.setItem("recentSearches", JSON.stringify(value));
        });

        onMount(() => {
            inputElement.focus();
        });
    });

    function clear() {
        results = { state: "NO_REQUESTED" };
        searchQuery = "";
        lastQuery = "";
    }

    function nextPage() {
        if (results.state !== "DONE") return;
        if (results.value.length < 20) return;
        currentPage += 1;
        doSearch(searchQuery, currentPage);
    }

    async function previousPage() {
        if (results.state !== "DONE") return;
        if (results.value.length === 0 || currentPage <= 1) return;
        currentPage -= 1;
        doSearch(searchQuery, currentPage);
    }

    async function search() {
        if (!searchQuery?.trim()) return;
        currentPage = 1;
        doSearch(searchQuery, 1);
    }

    async function doSearch(query: string, page: number): Promise<void> {
        results = {
            state: 'FETCHING',
            value: results.state === 'DONE' ? results.value : []
        };
        lastQuery = query;
        const finalQuery = query.trim();
        const config = loadConfig();
        if (finalQuery === "") return;

        const response = await fetch(
            `${
                config.apiUrl
            }?page=${page}&per_page=20&query=${encodeURIComponent(
                searchQuery,
            )}`,
        );
        if (response.status !== 200) {
            console.error("Error fetching data", response);
            return;
        }
        const data: RUCResult[] = await response.json();

        results = { state: "DONE", value: data };
        recentSearches.update((searches) => {
            if (data?.length === 1)
                return [
                    data[0],
                    ...searches.filter((s) => s.ruc !== data[0].ruc),
                ].slice(0, 10);
            return searches;
        });
    }

    function copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
    }
</script>

<div class="p-4 flex space-y-4 flex-col">
    <div
        class="flex justify-center flex-wrap space-x-2 sm:flex-row flex-col space-y-2 items-center sm:items-baseline"
    >
        <input
            type="text"
            bind:value={searchQuery}
            bind:this={inputElement}
            on:keydown={(e) => e.key === "Enter" && search()}
            class="p-2 rounded-md bg-gray-600 text-gray-100"
            placeholder="4787587, ASISMED, Arturo"
        />

        <div class="inline-flex">
            <button
                on:click={search}
                class="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-l"
                >Buscar</button
            >
            <button
                on:click={clear}
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >Limpiar</button
            >
        </div>
    </div>
    {#if results.state === "DONE"}
        {#if results.value.length === 0}
            <h1 class="text-left text-gray-400">
                No se encuentran registros con la búsqueda: <b>'{lastQuery}'</b>
            </h1>
        {:else}
            <div
                class="p-4 pr-6 rounded-md shadow text-white border-gray-300 bg-gray-700"
            >
                <h1 class="text-left text-gray-400">Resultado de búsqueda</h1>
                <ul class="mt-4">
                    <div class="min-w-sm result-container">
                        {#each results.value as result (result.ruc)}
                            <span class="justify-self-end">
                                {result.ruc}‑{result.dv}
                            </span>
                            <CopyToClipboard
                                text={result.name}
                                title="Copiar '{result.name}'"
                            />
                            <span class="justify-self-start">
                                {result.name}
                            </span>
                        {/each}
                    </div>
                </ul>
            </div>
            <div class="p-4 pr-6 rounded-md shadow text-white border-gray-300">
                {#if results.value.length === 20 || currentPage !== 1}
                    <div>Página <b>{currentPage}</b></div>
                    <ul class="inline-flex -space-x-px text-sm">
                        <li>
                            <button
                                type="button"
                                on:click={previousPage}
                                disabled={currentPage === 1}
                                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >Página Anterior
                            </button>
                        </li>
                        <li>
                            <button
                                disabled={results.value.length < 20}
                                on:click={nextPage}
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >Siguiente
                            </button>
                        </li>
                    </ul>
                {/if}
            </div>
        {/if}
    {:else if results.state === "FETCHING"}
        <div class="text-center m-auto">
            <Loading />
            <div role="status">
                <span class="sr-only">Buscando...</span>
            </div>
        </div>
    {:else if results.state === "ERROR"}
        Error
    {:else}
        <span class="text-gray-400">
            Puedes buscar por nombre (si es persona fisica primero pon el
            apellido) o por numero de RUC (sin digito verificador)
        </span>
        {#if !$recentSearches || $recentSearches.length === 0}{:else}
            <div
                class="p-4 pr-6 rounded-md shadow text-white border-gray-300 bg-gray-700"
            >
                <h1 class="text-left text-gray-400">Búsquedas anteriores</h1>
                <ul class="mt-4">
                    <div class="sm:min-w-sm result-container">
                        {#each $recentSearches as search (search.ruc)}
                            <span class="justify-self-end">
                                {search.ruc}‑{search.dv}
                            </span>
                            <CopyToClipboard
                                text={search.name}
                                title="Copiar '{search.name}'"
                            />
                            <span class="justify-self-start">
                                {search.name}
                            </span>
                        {/each}
                    </div>
                </ul>
            </div>
        {/if}
    {/if}
</div>
