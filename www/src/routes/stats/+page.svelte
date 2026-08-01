<script lang="ts">
    import { onMount } from "svelte";
    import { loadConfig, statsUrl } from "$lib/config";
    import Loading from "../../components/Loading.svelte";

    type Stat = { label: string; count: number };

    type Async<T> =
        | { state: "FETCHING" }
        | { state: "ERROR" }
        | { state: "DONE"; value: T };

    let stats: Async<Stat[]> = { state: "FETCHING" };

    const numberFormat = new Intl.NumberFormat("es-PY", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    // We don't have a friendly name for every raw state code coming from SET,
    // so only the ones we do know get relabeled; everything else shows as-is.
    const knownLabels: Record<string, string> = {
        total: "Total de RUCs",
    };

    function labelFor(label: string): string {
        return knownLabels[label] ?? label;
    }

    onMount(async () => {
        const config = loadConfig();
        try {
            const response = await fetch(statsUrl(config));
            if (response.status !== 200) {
                stats = { state: "ERROR" };
                return;
            }
            const data: Stat[] = await response.json();
            stats = { state: "DONE", value: data };
        } catch (err) {
            console.error("Error fetching stats", err);
            stats = { state: "ERROR" };
        }
    });
</script>

<div class="p-4 flex space-y-4 flex-col">
    <div class="text-white">
        <h1 class="text-3xl font-bold m-2">Estadísticas</h1>
        <h2 class="text-gray-400">Resumen de los RUCs cargados en el portal</h2>
    </div>

    {#if stats.state === "FETCHING"}
        <div class="text-center m-auto">
            <Loading />
        </div>
    {:else if stats.state === "ERROR"}
        <span class="text-gray-400">
            No se pudieron cargar las estadísticas, intenta de nuevo más tarde.
        </span>
    {:else}
        <div class="flex flex-wrap gap-4 justify-center">
            {#each stats.value as stat (stat.label)}
                <div
                    class="p-4 rounded-md shadow bg-gray-700 border-gray-300 min-w-[10rem] text-center"
                >
                    <div class="text-gray-400">{labelFor(stat.label)}</div>
                    <div class="text-white text-3xl font-semibold">
                        {numberFormat.format(stat.count)}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
