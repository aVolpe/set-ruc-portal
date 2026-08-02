<script lang="ts">
    import { onMount } from "svelte";
    import { loadConfig, statsUrl } from "$lib/config";
    import Loading from "../../components/Loading.svelte";

    type Stat = { label: string; count: number };
    type ChartRow = {
        label: string;
        displayLabel: string;
        count: number;
        pct: number;
        color: string;
    };

    type Async<T> =
        | { state: "FETCHING" }
        | { state: "ERROR" }
        | { state: "DONE"; value: T };

    let stats: Async<Stat[]> = { state: "FETCHING" };

    const numberFormat = new Intl.NumberFormat("es-PY", {
        notation: "compact",
        maximumFractionDigits: 1,
    });
    const countFormat = new Intl.NumberFormat("es-PY");

    // Fixed slot order, assigned by rank (biggest state first) rather than by
    // matching specific status codes, since SET's codes aren't documented and
    // may change. Colorblind-safe as a set (validated against this page's dark
    // card background).
    const CATEGORICAL_COLORS = [
        "#3987e5",
        "#d95926",
        "#199e70",
        "#c98500",
        "#d55181",
    ];
    const OTHER_COLOR = "#6b7280";
    const TOP_N = 5;
    // A near-zero slice would render as an invisible sliver; give it a floor
    // just so it stays hoverable. The printed count/% next to it is exact.
    const MIN_VISIBLE_PCT = 0.5;

    function toSentenceCase(label: string): string {
        const trimmed = label.trim();
        if (!trimmed) return "(sin estado)";
        return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
    }

    // Every state we don't recognize as one of the top N by volume gets
    // folded into "Otros" instead of getting its own tile/bar, since a
    // handful of them are one-off data anomalies (see joiner.rs), not real
    // recurring statuses. Nothing is discarded: the raw entries are still
    // listed in the detail table below.
    function groupStats(input: Stat[]): {
        total: number;
        rows: ChartRow[];
        otherItems: Stat[];
    } {
        const totalEntry = input.find((s) => s.label === "total");
        const total =
            totalEntry?.count ??
            input.reduce((sum, s) => sum + s.count, 0);

        const states = input
            .filter((s) => s.label !== "total")
            .sort((a, b) => b.count - a.count);

        const top = states.slice(0, TOP_N);
        const rest = states.slice(TOP_N);
        const otherCount = rest.reduce((sum, s) => sum + s.count, 0);

        const rows: ChartRow[] = top.map((s, i) => ({
            label: s.label,
            displayLabel: toSentenceCase(s.label),
            count: s.count,
            pct: total > 0 ? (s.count / total) * 100 : 0,
            color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
        }));

        if (rest.length > 0) {
            rows.push({
                label: "otros",
                displayLabel: `Otros (${rest.length})`,
                count: otherCount,
                pct: total > 0 ? (otherCount / total) * 100 : 0,
                color: OTHER_COLOR,
            });
        }

        return { total, rows, otherItems: rest };
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
        {@const grouped = groupStats(stats.value)}

        <div
            class="p-4 rounded-md shadow bg-gray-700 border-gray-300 text-center mx-auto"
        >
            <div class="text-gray-400">Total de RUCs</div>
            <div class="text-white font-semibold" style="font-size: 3rem;">
                {numberFormat.format(grouped.total)}
            </div>
        </div>

        <div
            class="p-4 rounded-md shadow bg-gray-700 border-gray-300 flex flex-col gap-3"
        >
            {#each grouped.rows as row (row.label)}
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <div class="sm:w-48 shrink-0 text-gray-300 text-sm">
                        {row.displayLabel}
                    </div>
                    <div class="flex-1 bg-gray-800 rounded h-6 min-w-[6rem]">
                        <div
                            class="h-6 rounded-r"
                            style="width: {Math.max(row.pct, MIN_VISIBLE_PCT)}%; background-color: {row.color};"
                            title="{row.displayLabel}: {countFormat.format(row.count)} ({row.pct.toFixed(1)}%)"
                        ></div>
                    </div>
                    <div class="sm:w-36 shrink-0 flex justify-end gap-2 text-white text-sm">
                        <span class="tabular-nums text-right w-20">{countFormat.format(row.count)}</span>
                        <span class="tabular-nums text-right w-12">{row.pct.toFixed(1)}%</span>
                    </div>
                </div>
            {/each}

            <details class="mt-2 text-gray-400 text-sm">
                <summary class="cursor-pointer">Ver detalle completo</summary>
                <div class="overflow-x-auto">
                    <table class="mt-2 w-full text-left">
                        <thead>
                            <tr class="text-gray-500">
                                <th class="pr-4 text-left">Estado</th>
                                <th class="pr-4 text-right">Cantidad</th>
                                <th class="text-right">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each grouped.rows as row (row.label)}
                                <tr>
                                    <td class="pr-4">{row.displayLabel}</td>
                                    <td class="pr-4 text-right tabular-nums">{countFormat.format(row.count)}</td>
                                    <td class="text-right tabular-nums">{row.pct.toFixed(2)}%</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                {#if grouped.otherItems.length > 0}
                    <div class="mt-3">
                        <div class="text-gray-500 mb-1">
                            Agrupados en "Otros" ({grouped.otherItems.length}):
                        </div>
                        <ul class="list-disc list-inside">
                            {#each grouped.otherItems as item (item.label)}
                                <li>
                                    {item.label || "(sin estado)"} — {countFormat.format(item.count)}
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </details>
        </div>
    {/if}
</div>
