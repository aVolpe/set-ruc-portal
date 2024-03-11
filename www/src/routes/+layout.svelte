<script>
    import { writable } from "svelte/store";
    import "../app.css";
    import { onMount } from "svelte";
    let year = new Date().getFullYear();

    const items = [
        { url: "/", text: "Búsqueda RUCs" },
        { url: "/download", text: "Bajar archivos" },
        { url: "/snippets", text: "Code Snippets" },
        { url: "/about", text: "Acerca de" },
    ];

    const current = writable("");
    onMount(() => {
        const pathname = window.location.pathname;
        current.set(pathname || "/");
        console.log({current, pathname});
    })
</script>

<div
    class="flex flex-col items-center justify-flex-start min-h-screen bg-gray-900"
>
    <div
        class="sticky top-0 z-40 flex-none w-full mx-auto bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800"
    >
        <nav class="bg-white border-gray-200 dark:bg-gray-900">
            <div
                class="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4"
            >
                <div
                    class="hidden w-full md:block md:w-auto"
                    id="navbar-default"
                >
                    <ul
                        class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
                    >
                        {#each items as item (item.url)}
                            <li>
                                <a
                                    href={item.url}
                                    on:click={() => $current = item.url}
                                    class={item.url === $current
                                        ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                                        : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"}
                                    aria-current="page">{item.text}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </nav>
    </div>

    <div class="p-4 text-center flex-grow">
        <slot />
    </div>

    <footer class="w-full text-center p-4 bg-gray-900 text-gray-200">
        &copy; {year} Arturo Volpe
    </footer>
</div>
