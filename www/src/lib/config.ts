

export interface Config {
    apiUrl: string;
    jsonDBFilePath: string
    csvDBFilePath: string
}

const DEV_DATA: Config = {
    apiUrl: "http://localhost:8000/api/data",
    jsonDBFilePath: "",
    csvDBFilePath: ""
}

/**
 * In a docker environment, the script `start-container.sh` will put a property called '_env' in the window.
 *
 * This method will use that config and the correct 'flavour' and generate the correct config.
 */
export function loadConfig(): Config {

    // @ts-ignore
    const source: Config = window.__env;
    return {
        ...DEV_DATA,
        ...source
    };
}

/**
 * The stats endpoint lives next to the data endpoint (`/api/data` -> `/api/stats`),
 * so it's derived instead of requiring its own config entry.
 */
export function statsUrl(config: Config): string {
    return config.apiUrl.replace(/data$/, "stats");
}
