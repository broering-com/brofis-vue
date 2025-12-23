export const STALL_CARD_TABLE_HEAD_OBJECT_TREE = {
    date: { label: "Datum", col: { width: "12ch", class: "border-r" } },
    day: { label: "Tag", col: { width: "6ch", class: "border-r" } },

    losses: {
        label: "Verluste",
        order: ["small", "selected", "dead", "total", "cumulated"],
        children: {
            small: {
                label: "Kleine",
                order: ["m", "a"],
                children: {
                    morning: { label: "M", col: { width: "5ch", class: "col-tiere" } },
                    evening: { label: "A", col: { width: "5ch", class: "col-tiere" } },
                },
            },
            selected: {
                label: "Selektierte",
                order: ["m", "a"],
                children: {
                    morning: { label: "M", col: { width: "5ch", class: "col-tiere" } },
                    evening: { label: "A", col: { width: "5ch", class: "col-tiere" } },
                },
            },
            dead: {
                label: "Tote",
                order: ["m", "a"],
                children: {
                    morning: { label: "M", col: { width: "5ch", class: "col-tiere" } },
                    evening: { label: "A", col: { width: "5ch", class: "col-tiere" } },
                },
            },

            total: { label: "Total", col: { width: "6ch", class: "col-tiere" } },

            cumulated: {
                label: "Kumuliert",
                order: ["empty", "percentage"],
                children: {
                    empty: { label: "", col: { width: "7ch", class: "col-tiere" } },
                    percentage: { label: "%", col: { width: "5ch", class: "col-tiere" } },
                },
            },
        },
    },

    living_animals: { label: "Lebende Tiere", col: { width: "8ch", class: "col-tiere border-r" } },
    remarks: { label: "Bemerkungen", col: { width: "20ch", class: "border-r" } },

    temperature: {
        label: "Temperatur",
        order: ["target", "min", "max"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "°C", col: { width: "6ch", class: "col-klima soll" } },
                },
            },
            min: {
                label: "Min.",
                children: {
                    unit: { label: "°C", col: { width: "6ch", class: "col-klima" } },
                },
            },
            max: {
                label: "Max.",
                children: {
                    unit: { label: "°C", col: { width: "6ch", class: "col-klima border-r" } },
                },
            },
        },
    },

    humidity: {
        label: "Feuchtigkeit",
        order: ["target", "min", "max"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "%", col: { width: "5ch", class: "col-klima soll" } },
                },
            },
            min: {
                label: "Min.",
                children: {
                    unit: { label: "%", col: { width: "5ch", class: "col-klima" } },
                },
            },
            max: {
                label: "Max.",
                children: {
                    unit: { label: "%", col: { width: "5ch", class: "col-klima border-r" } },
                },
            },
        },
    },

    enthalpy: {
        label: "Enthalpie",
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "kJ/kg", col: { width: "9ch", class: "col-klima soll border-r" } },
                },
            },
        },
    },

    water: {
        label: "Wasser",
        children: {
            total: {
                label: "Total",
                children: {
                    unit: { label: "l", col: { width: "8ch", class: "col-wasser" } },
                },
            },
        },
    },

    water_per_animal: {
        label: "Wasser pro Tier",
        order: ["target", "actual"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "ml", col: { width: "6ch", class: "col-wasser soll" } },
                },
            },
            actual: {
                label: "Ist",
                children: {
                    unit: { label: "ml", col: { width: "6ch", class: "col-wasser border-r" } },
                },
            },
        },
    },

    mixed_feed: {
        label: "Misch-<br>futter",
        children: {
            total: {
                label: "Total",
                children: {
                    unit: { label: "kg", col: { width: "8ch", class: "col-futter" } },
                },
            },
        },
    },

    wheat_feed: {
        label: "Weizen",
        children: {
            total: {
                label: "Total",
                children: {
                    unit: { label: "kg", col: { width: "8ch", class: "col-futter" } },
                },
            },
        },
    },

    feed_total: {
        label: "Futter (Gesamt)",
        children: {
            total: {
                label: "Total",
                children: {
                    unit: { label: "kg", col: { width: "8ch", class: "col-futter" } },
                },
            },
        },
    },

    feed_total_per_animal: {
        label: "Futter (Gesamt) pro Tier",
        order: ["target", "actual"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "g", col: { width: "6ch", class: "col-futter soll" } },
                },
            },
            actual: {
                label: "Ist",
                children: {
                    unit: { label: "g", col: { width: "6ch", class: "col-futter" } },
                },
            },
        },
    },

    feed_cumulated_per_animal: {
        label: "Futter (Kumuliert) pro Tier",
        order: ["target", "actual"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "g", col: { width: "7ch", class: "col-futter soll" } },
                },
            },
            actual: {
                label: "Ist",
                children: {
                    unit: { label: "g", col: { width: "7ch", class: "col-futter" } },
                },
            },
        },
    },

    wheat_ratio: {
        label: "Weizen",
        children: {
            unit: { label: "%", level: 3, col: { width: "8ch", class: "col-futter border-r" } },
        },
    },

    water_feed_ratio: { label: "Wasser Futter Verhältnis", col: { width: "10ch", class: "" } },
    litter_quality: { label: "Einstreu-<br>qualität", col: { width: "10ch", class: "border-r" } },

    animal_weight: {
        label: "Tiergewicht",
        order: ["target", "actual"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "g", col: { width: "7ch", class: "col-gewicht soll" } },
                },
            },
            actual: {
                label: "Ist",
                children: {
                    unit: { label: "g", col: { width: "7ch", class: "col-gewicht border-r" } },
                },
            },
        },
    },

    gain: {
        label: "Zunahme",
        order: ["target", "actual"],
        children: {
            target: {
                label: "Soll",
                children: {
                    unit: { label: "g", col: { width: "6ch", class: "col-gewicht soll" } },
                },
            },
            actual: {
                label: "Ist",
                children: {
                    unit: { label: "g", col: { width: "6ch", class: "col-gewicht border-r" } },
                },
            },
        },
    },

    control: { label: "Kontrolle von Fütterung, Lüftung, Heizung / Alarm / Notstrom", col: { width: "18ch", class: "border-r" } },

    day_repeat: { label: "Tag", col: { width: "6ch", class: "" } },
};
