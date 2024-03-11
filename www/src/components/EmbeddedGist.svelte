<script lang="ts">

    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    export let gist = "";
    export let file = ""; // replace with your file name if any
    const loading = writable(true);
    const src = writable("");

    function addStylesheet(href: string) {

        const w : any = window
        if (!w.stylesheetAdded) {
            w.stylesheetAdded = true;
            const link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = href;

            document.head.appendChild(link);
        }
    }
    

    function nextGistCallback(): string {
        const w : any = window
        if (!w.gistCallbackId) {
            w.gistCallbackId = 1;
        }
        return "embed_gist_callback_" + (w.gistCallbackId)++;
    }

    onMount(() => {
        const gistCallback = nextGistCallback();
        const w : any = window;
        w[gistCallback] = function (gist: { div: string, stylesheet: string }) {
            loading.set(false);
            src.set(gist.div);
            addStylesheet(gist.stylesheet);
        };

        let url = "https://gist.github.com/" + gist + ".json?callback=" + gistCallback;
        if (file) {
            url += "&file=" + file;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.head.appendChild(script);
    });
</script>

{#if $loading}
    <div>loading {file}...</div>
{:else}
    {@html $src}
{/if}