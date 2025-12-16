export const STALL_CARD_TABLE_HEAD_OBJECT_TREE = {
    Date: { label: "Datum" },
    Day: { label: "Tag" },

    Losses: {
        label: "Verluste",
        order: ["small", "selected", "dead", "total", "cumulated"],
        children: {
            small: {
                label: "Kleine",
                order: ["m", "a"],
                children: {
                    m: { label: "M" },
                    a: { label: "A" },
                },
            },
            selected: {
                label: "Selektierte",
                order: ["m", "a"],
                children: {
                    m: { label: "M" },
                    a: { label: "A" },
                },
            },
            dead: {
                label: "Tote",
                order: ["m", "a"],
                children: {
                    m: { label: "M" },
                    a: { label: "A" },
                },
            },
            total: { label: "Total" }, // rowspan=2 automatisch
            cumulated: {
                label: "Kumuliert",
                order: ["empty", "percentage"],
                children: {
                    empty: { label: "" },
                    percentage: { label: "%" },
                },
            },
        },
    },

    livingAnimals: { label: "Lebende Tiere" },
    remarks: { label: "Bemerkungen" },

    temperature: {
        label: "Temperatur",
        order: ["target", "min", "max"],
        children: {
            target: { label: "Soll", children: { unit: { label: "°C" } } },
            min: { label: "Min.", children: { unit: { label: "°C" } } },
            max: { label: "Max.", children: { unit: { label: "°C" } } },
        },
    },

    humidity: {
        label: "Feuchtigkeit",
        order: ["target", "min", "max"],
        children: {
            target: { label: "Soll", children: { unit: { label: "%" } } },
            min: { label: "Min.", children: { unit: { label: "%" } } },
            max: { label: "Max.", children: { unit: { label: "%" } } },
        },
    },

    enthalpy: {
        label: "Enthalpie",
        children: {
            target: { label: "Soll", children: { unit: { label: "kJ/kg" } } },
        },
    },

    water: {
        label: "Wasser",
        children: {
            total: { label: "Total", children: { unit: { label: "l" } } },
        },
    },

    waterPerAnimal: {
        label: "Wasser pro Tier",
        order: ["target", "actual"],
        children: {
            target: { label: "Soll", children: { unit: { label: "ml" } } },
            actual: { label: "Ist", children: { unit: { label: "ml" } } },
        },
    },

    mixedFeed: {
        label: "Misch-<br>futter",
        children: {
            total: { label: "Total", children: { unit: { label: "kg" } } },
        },
    },

    wheatFeed: {
        label: "Weizen",
        children: {
            total: { label: "Total", children: { unit: { label: "kg" } } },
        },
    },

    feedTotal: {
        label: "Futter (Gesamt)",
        children: {
            total: { label: "Total", children: { unit: { label: "kg" } } },
        },
    },

    feedTotalPerAnimal: {
        label: "Futter (Gesamt) pro Tier",
        order: ["target", "actual"],
        children: {
            target: { label: "Soll", children: { unit: { label: "g" } } },
            actual: { label: "Ist", children: { unit: { label: "g" } } },
        },
    },

    feedCumulatedPerAnimal: {
        label: "Futter (Kumuliert) pro Tier",
        order: ["target", "actual"],
        children: {
            target: { label: "Soll", children: { unit: { label: "g" } } },
            actual: { label: "Ist", children: { unit: { label: "g" } } },
        },
    },

    wheatRatio: {
        label: "Weizen",
        children: {
            unit: { label: "%", level: 3 }, // rowspan=2
        },
    },

    waterFeedRatio: { label: "Wasser Futter Verhältnis" },
    litterQuality: { label: "Einstreu-<br>qualität" },

    animalWeight: {
        label: "Tiergewicht",
        order: ["target", "actual"],
        children: {
            target: { label: "Soll", children: { unit: { label: "g" } } },
            actual: { label: "Ist", children: { unit: { label: "g" } } },
        },
    },

    gain: {
        label: "Zunahme",
        order: ["target", "actual"],
        children: {
            target: { label: "Soll", children: { unit: { label: "g" } } },
            actual: { label: "Ist", children: { unit: { label: "g" } } },
        },
    },

    control: {
        label:
            "Kontrolle von Fütterung, Lüftung, Heizung / Alarm / Notstrom",
    },

    DayRepeat: { label: "Tag" },
};
