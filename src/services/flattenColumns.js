// flattenColumns.js
function isObj(v) {
    return v && typeof v === "object" && !Array.isArray(v);
}

function getChildEntries(node) {
    if (!isObj(node.children)) return [];

    const keys = Object.keys(node.children);

    if (Array.isArray(node.order) && node.order.length) {
        const set = new Set(node.order);
        return [
            ...node.order.filter(k => keys.includes(k)).map(k => [k, node.children[k]]),
            ...keys.filter(k => !set.has(k)).map(k => [k, node.children[k]]),
        ];
    }

    return keys.map(k => [k, node.children[k]]);
}

export function flattenColumns(tree) {
    const cols = [];

    function walk(node, keyPath = []) {
        if (!isObj(node)) return;

        // Leaf = keine children
        if (!node.children || Object.keys(node.children).length === 0) {
            if (node.col) {
                cols.push({
                    key: keyPath.join("."),
                    width: node.col.width ?? "auto",
                    class: node.col.class ?? "",
                    defaultWidth: node.col.defaultWidth,
                });
            }
            return;
        }

        for (const [key, child] of getChildEntries(node)) {
            walk(child, [...keyPath, key]);
        }
    }

    for (const [key, node] of Object.entries(tree)) {
        walk(node, [key]);
    }

    return cols;
}
