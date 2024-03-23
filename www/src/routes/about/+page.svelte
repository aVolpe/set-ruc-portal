<script lang="ts">
    import { onMount } from "svelte";

    interface NodePackageInfo {
        department: string;
        relatedTo: string;
        name: string;
        licensePeriod: string;
        material: string;
        licenseType: string;
        link: string;
        remoteVersion: string;
        installedVersion: string;
        definedVersion: string;
        author: string;
    }

    interface CargoPackageInfo {
        name: string;
        version: string;
        authors: string | null;
        repository: string;
        license: string;
        license_file: string | null;
        description: string;
    }

    interface PackgeInfo {
        _id: string;
        name: string;
        version: string;
        usedIn: string;
        link: string;
        license: string;
    }

    function map(format: string, source: string, raw: unknown): PackgeInfo {
        if (format === "npm") {
            const pkg = raw as NodePackageInfo;
            return {
                _id: `${source}@${pkg.name}`,
                name: pkg.name,
                version: pkg.installedVersion,
                usedIn: source,
                link: `${pkg.link}`.replace(/^git\+/, ""),
                license: pkg.licenseType,
            };
        } else {
            const pkg = raw as CargoPackageInfo;
            return {
                _id: `${source}@${pkg.name}`,
                name: pkg.name,
                version: pkg.version,
                usedIn: source,
                link: pkg.repository,
                license: pkg.license,
            };
        }
    }

    let licenses: PackgeInfo[] = [];

    onMount(async () => {
        const sources = {
            portal: { format: "npm", path: "/license_info/www.json" },
            api: { format: "cargo", path: "/license_info/api.json" },
            downloader: { format: "cargo", path: "/license_info/downloader.json" },
        };

        try {
            const responses = await Promise.all(
                Object.entries(sources).map(
                    async ([source, { format, path }]) => {
                        const response = await fetch(path);
                        console.log(`Response from ${source}: ${response.status}`);
                        if (!response.ok) {
                            console.log(
                                `Error loading license info for ${source}`,
                            );
                            return { source, format, packages: [] };
                        }
                        return response.json().then((rows) => ({
                            source,
                            format,
                            packages: rows,
                        }));
                    },
                ),
            );
            Promise.all(responses).then((data) => {
                licenses = data.flatMap((response) =>
                    response.packages.map((raw: unknown) => map(response.format, response.source, raw)),
                ).filter((pkg) => !!pkg.link);
            });
        } catch (error) {
            console.error("Error fetching licenses:", error);
        }
    });
</script>

<div class="p-4 flex space-y-4 flex-col">
    <div class="text-white">
        <h1 class="text-4xl font-bold m-2">Acerca de</h1>
        <h2 style="max-width:500px;margin:auto">
            Portal que permite consultar y descargar la lista de todas las
            personas juridicas que forman parte de la base de datos de la 
            <a href="www.set.gov.py" class="underline" >Secretaria de Estado de Tributación (www.set.gov.py)</a>.
        </h2>
    </div>
    <div class="text-white">
        <h1 class="text-3xl font-bold m-2">Proyectos open source utilizados</h1>
        <h2>
            <table class="table-auto">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Versión</th>
                        <th>Usado en</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody class="text-left">
                    {#each licenses as pkg (pkg._id)}
                        <tr>
                            <td>{pkg.name}</td>
                            <td class="text-right pl-2">{pkg.version}</td>
                            <td class="text-right pl-2">{pkg.usedIn}</td>
                            <td class="text-right pl-2"><a href={pkg.link} class="underline">{pkg.link}</a></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </h2>
    </div>
</div>
