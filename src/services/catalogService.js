import { httpClient } from "./httpClient";
import { CATALOG_KEY_MAP } from "./CATALOG_KEY_MAP";
import { useUserConfig } from "@/services/userConfigService.js";

const { get } = httpClient;

const STORAGE_KEY = "catalog";
const DATETIME_KEY = "catalogDateTime";

const { userConfig } = useUserConfig();

function loadCatalog() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
        return null;
    }
}

function saveCatalog(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadCatalogDates() {
    try {
        return JSON.parse(localStorage.getItem(DATETIME_KEY)) || null;
    } catch {
        return null;
    }
}

function saveCatalogDates(data) {
    localStorage.setItem(DATETIME_KEY, JSON.stringify(data));
}

// Hilfsfunktion fürs Alter in Tagen
function diffDays(from, to = new Date()) {
    return (to - from) / (1000 * 60 * 60 * 24);
}

// lädt dynamic ODER static (nur eins!)
async function updateCatalogPart(part) {
    const res = await get(`/catalog/${part}`);
    const catalog = loadCatalog() || {};

    catalog[part] = res.catalog;
    saveCatalog(catalog);

    const ts = loadCatalogDates() || {};
    ts[part] = new Date().toISOString();
    saveCatalogDates(ts);

    return catalog;
}

// Prüft, ob "static" neu geladen werden muss
function needsReloadStatic(ts, minCatalogDateTime) {
    if (!ts?.static) return true;

    const staticTime = new Date(ts.static);
    const minTime = new Date(minCatalogDateTime);

    return staticTime < minTime;
}

// Prüft, ob "dynamic" neu geladen werden muss
function needsReloadDynamic(ts, minCatalogDateTime, maxCatalogAge) {
    if (!ts?.dynamic) return true;

    const dynamicTime = new Date(ts.dynamic);
    const minTime = new Date(minCatalogDateTime);
    const ageDays = diffDays(dynamicTime);

    return dynamicTime < minTime || ageDays > maxCatalogAge;
}

/**
 * Prüft nach dem Login die Aktualität beider Kataloge
 */
async function ensureCatalogUpToDate() {
    const { minCatalogDateTime, maxCatalogAge } = userConfig.value || {};

    let catalog = loadCatalog();
    let ts = loadCatalogDates();

    if (!catalog || !ts) {
        return await updateFullCatalog();
    }

    // STATIC prüfen
    if (needsReloadStatic(ts, minCatalogDateTime)) {
        catalog = await updateCatalogPart("static");
        ts = loadCatalogDates(); // neu laden
    }

    // DYNAMIC prüfen
    if (needsReloadDynamic(ts, minCatalogDateTime, maxCatalogAge)) {
        catalog = await updateCatalogPart("dynamic");
    }

    return catalog;
}

/**
 * Lädt BEIDE Kataloge (dynamic + static)
 */
async function updateFullCatalog() {
    const [dynamicRes, staticRes] = await Promise.all([
        get("/catalog/dynamic"),
        get("/catalog/static"),
    ]);

    const data = {
        dynamic: dynamicRes.catalog,
        static: staticRes.catalog,
    };

    saveCatalog(data);

    const ts = {
        dynamic: new Date().toISOString(),
        static: new Date().toISOString(),
    };
    saveCatalogDates(ts);

    return data;
}

/**
 * Holt Daten anhand des gemappten Keys
 */
async function getCatalogData(key) {
    const mapping = CATALOG_KEY_MAP[key];

    if (!mapping) {
        throw new Error(`Unknown catalog key: "${key}".`);
    }

    const catalog = await ensureCatalogUpToDate();

    let current = catalog[mapping.root];
    for (const segment of mapping.path) {
        if (!current) break;
        current = current[segment];
    }

    return current;
}

function clearCatalog(type) {
    const catalogDateRaw = localStorage.getItem(DATETIME_KEY)
    let catalogDate = {}

    if (catalogDateRaw) {
        try {
            catalogDate = JSON.parse(catalogDateRaw) || {}
        } catch (e) {
            console.error('Konnte catalogDate nicht parsen:', e)
            catalogDate = {}
        }
    }

    delete catalogDate[type]
    saveCatalogDates(catalogDate)

    let catalog = loadCatalog() || {}
    delete catalog[type]
    saveCatalog(catalog)
}

// Composition API Support
export function useCatalogService() {
    return {
        getCatalogData,
        ensureCatalogUpToDate,
        clearCatalog,
    };
}

export const catalogService = {
    getCatalogData,
    ensureCatalogUpToDate,
    clearCatalog,
};
