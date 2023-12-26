<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";

    type RUCResult = {
        ruc: string;
        nombre: string;
        dv: string;
    };

    let searchQuery: string = "";
    let results: Array<RUCResult> = [];
    let recentSearches: Writable<RUCResult[]> = writable([]);
    let currentPage: number = 1;

    onMount(() => {
        recentSearches.set(
            JSON.parse(localStorage?.getItem("recentSearches") || "[]"),
        );
        // results = JSON.parse(localStorage?.getItem("recentSearches") || "[]");
        recentSearches.subscribe((value) => {
            localStorage?.setItem("recentSearches", JSON.stringify(value));
        });
    });

    function clear() {
        results = [];
        searchQuery = "";
    }

    function nextPage() {
        if (results.length < 20) return;
        currentPage += 1;
        doSearch(searchQuery, currentPage + 1);
    }

    async function previousPage() {
        if (results.length === 0 || currentPage <= 1) return;
        currentPage -= 1;
        doSearch(searchQuery, currentPage - 1);
    }

    async function search() {
        if (!searchQuery?.trim()) return;
        currentPage = 1;
        doSearch(searchQuery, 1);
    }

    async function doSearch(query: string, page: number): Promise<void> {
        const finalQuery = query.trim();
        if (finalQuery === "") return;

        const response = await fetch(
            `http://localhost:8000/api/data?page=${page}&per_page=20&query=${encodeURIComponent(
                searchQuery,
            )}`,
        );
        const data: RUCResult[] = await response.json();

        results = data;
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
    <div class="flex justify-center flex-wrap space-x-2 sm:flex-row flex-col space-y-2 items-center sm:items-baseline">
        <input
            type="text"
            bind:value={searchQuery}
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

    {#if results.length > 0}
        <div
            class="p-4 pr-6 rounded-md shadow text-white border-gray-300 bg-gray-700"
        >
            <h1 class="text-left text-gray-400">Resultado de búsqueda:</h1>
            <ul class="mt-4">
                {#each results as result (result.ruc)}
                    <li>
                        <div class="flex space-x-4 justify-around">
                            <span>
                                {result.ruc}-{result.dv}
                            </span>
                            <span class="flex-grow">
                                {result.nombre}
                            </span>
                            <button
                                title="Copiar '{result.nombre}'"
                                on:click={() => copyToClipboard(result.nombre)}
                                class="size-2">📋</button
                            >
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        <div
            class="p-4 pr-6 rounded-md shadow text-white border-gray-300"
        >
            {#if results.length === 20 || currentPage !== 1}
                <div>Página <b>{currentPage}</b></div>
                <div class="inline-flex">
                    <button
                        on:click={previousPage}
                        disabled={currentPage === 1}
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                        >Página Anterior</button
                    >
                    <button
                        disabled={results.length < 20}
                        on:click={nextPage}
                        class="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-r"
                        >Siguiente</button
                    >
                </div>
            {/if}
            </div>
    {:else}
        <span class="text-gray-400">
            Puedes buscar por nombre (si es persona fisica primero pon el
            apellido) o por numero de RUC (sin digito verificador)
        </span>
        {#if !$recentSearches || $recentSearches.length === 0}{:else}
            <div
                class="p-4 pr-6 rounded-md shadow text-white border-gray-300 bg-gray-700"
            >
                <h1 class="text-left text-gray-400">Búsquedas anteriores:</h1>
                <ul class="mt-4">
                    {#each $recentSearches as search (search.ruc)}
                        <li>
                            <div class="flex space-x-4 justify-around">
                                <span>
                                    {search.ruc}-{search.dv}
                                </span>
                                <span class="flex-grow">
                                    {search.nombre}
                                </span>
                                <button
                                    title="Copiar '{search.nombre}'"
                                    on:click={() =>
                                        copyToClipboard(search.nombre)}
                                    class="size-2">📋</button
                                >
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    {/if}
</div>
