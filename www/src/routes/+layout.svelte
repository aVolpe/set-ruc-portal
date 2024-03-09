<script>
    import "../app.css";
    let year = new Date().getFullYear();
</script>

<div class="flex flex-col items-center justify-flex-start min-h-screen bg-gray-800">
    <nav class="flex justify-around w-full p-4 bg-gray-900 text-gray-300 text-1xl font-semibold">
        <a href="/" class="hover:underline">Búsqueda RUCs</a>
        <a href="/download" class="hover:underline">Bajar archivos</a>
        <a href="/snippets" class="hover:underline">Code Snippets</a>
        <a href="/about" class="hover:underline">Acerca de</a>
    </nav>


    <div class="p-4 text-center flex-grow">
        <slot></slot>
    </div>

    <footer class="w-full text-center p-4 bg-gray-900 text-gray-200">
        &copy; {year} Arturo Volpe
    </footer>
</div>