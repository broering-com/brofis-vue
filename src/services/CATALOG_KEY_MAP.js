// Katalog-Map, um beim Abruf "static" und "dynamic" zu vermeiden
export const CATALOG_KEY_MAP = {
    // STATIC-CATALOG: Sollwerte
    sollwerte: {
        root: "static",
        path: ["Sollwerte"],
    },

    // ROSS
    sollwerteRoss308: {
        root: "static",
        path: ["Sollwerte", "ROSS 308"],
    },
    sollwerteRoss708: {
        root: "static",
        path: ["Sollwerte", "ROSS 708"],
    },

    // COBB
    sollwerteCobb500: {
        root: "static",
        path: ["Sollwerte", "COBB 500"],
    },
    sollwerteCobb700: {
        root: "static",
        path: ["Sollwerte", "COBB 700"],
    },

    // Ranger
    sollwerteRangerClassic: {
        root: "static",
        path: ["Sollwerte", "Ranger Classic"],
    },
    sollwerteRangerGold: {
        root: "static",
        path: ["Sollwerte", "Ranger Gold"],
    },

    // Rustic – Achtung: "Rustic Classic " hat ein Leerzeichen am Ende im JSON!
    sollwerteRusticClassic: {
        root: "static",
        path: ["Sollwerte", "Rustic Classic "],
    },
    sollwerteRusticGold: {
        root: "static",
        path: ["Sollwerte", "Rustic Gold"],
    },

    // Hubbard
    sollwerteHubbardJa757: {
        root: "static",
        path: ["Sollwerte", "Hubbard JA 757"],
    },
    sollwerteHubbardJa787: {
        root: "static",
        path: ["Sollwerte", "Hubbard JA 787"],
    },
    sollwerteHubbardRedbro: {
        root: "static",
        path: ["Sollwerte", "Hubbard Redbro"],
    },

    // Platzhalter-Rasse "..."
    sollwertePlaceholder: {
        root: "static",
        path: ["Sollwerte", "..."],
    },

    // -----------------------------
    // STATIC-CATALOG: weitere Bereiche
    // -----------------------------
    antibiotika: {
        root: "static",
        path: ["Antibiotika"],
    },

    impfstoffe: {
        root: "static",
        path: ["Impfstoffe"],
    },

    schlachthoefe: {
        root: "static",
        path: ["Schlachthoefe"],
    },

    futterlieferanten: {
        root: "static",
        path: ["Futterlieferanten"],
    },

    bruetereien: {
        root: "static",
        path: ["Bruetereien"],
    },

    rassen: {
        root: "static",
        path: ["Rassen"],
    },

    kokzidiostatika: {
        root: "static",
        path: ["Kokzidiostatika"],
    },

    diagnosen: {
        root: "static",
        path: ["Diagnosen"],
    },

    schlupfbrutverfahren: {
        root: "static",
        path: ["Schlupfbrutverfahren"],
    },

    // -----------------------------
    // DYNAMIC-CATALOG
    // -----------------------------
    personen: {
        root: "dynamic",
        path: ["Personen"],
    },

    sonstigeMedikationen: {
        root: "dynamic",
        path: ["SonstigeMedikationen"],
    },

    einstreu: {
        root: "dynamic",
        path: ["Einstreu"],
    },

    desinfektionsmittel: {
        root: "dynamic",
        path: ["Desinfektionsmittel"],
    },

    futtermittel: {
        root: "dynamic",
        path: ["Futtermittel"],
    },
};