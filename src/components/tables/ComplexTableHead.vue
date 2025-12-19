<script setup>
import { computed } from "vue";

const props = defineProps({
  headerTree: { type: Object, required: true },

  // "head" => <thead><th>
  // "foot" => <tfoot><td> (umgedreht)
  mode: { type: String, default: "head" },

  // Set oder Array von Leaf-Keys, die ausgeblendet sind (z.B. "Losses.small.m")
  hiddenKeys: { type: [Array, Set], default: () => new Set() },
});

/**
 * checks if given object is type object
 */
function isObj(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

const hiddenSet = computed(() => {
  return props.hiddenKeys instanceof Set
    ? props.hiddenKeys
    : new Set(props.hiddenKeys ?? []);
});

/**
 * gives child entries of a node in correct order
 */
function childEntries(node) {
  const children = node?.children;
  if (!isObj(children)) return [];
  const keys = Object.keys(children);

  if (Array.isArray(node.order) && node.order.length) {
    const set = new Set(node.order);
    return [
      ...node.order.filter((k) => keys.includes(k)).map((k) => [k, children[k]]),
      ...keys.filter((k) => !set.has(k)).map((k) => [k, children[k]]),
    ];
  }
  return keys.map((k) => [k, children[k]]);
}

/**
 * builds a node from given key and node-like object
 * + adds `path` for stable leaf keys (e.g. "Losses.small.m")
 */
function buildNode(key, nodeLike, parentLevel, parentPath) {
  const node = isObj(nodeLike) ? nodeLike : {};
  const level = node.level ?? (parentLevel + 1);
  const label = node.label ?? key;

  const path = parentPath ? `${parentPath}.${key}` : key;

  const children = childEntries(node).map(([childkey, childnode]) =>
    buildNode(childkey, childnode, level, path)
  );

  return { key, label, level, children, path };
}

/**
 * flattens given object to flat array
 */
function flatten(root) {
  const out = [];
  (function walk(n) {
    out.push(n);
    n.children.forEach(walk);
  })(root);
  return out;
}

/**
 * counts only visible leaves (used for colspan when columns are hidden)
 */
function countVisibleLeaves(node) {
  if (!node.children.length) {
    // leaf is visible iff not in hidden set
    return hiddenSet.value.has(node.path) ? 0 : 1;
  }
  return node.children.reduce((sum, child) => sum + countVisibleLeaves(child), 0);
}

/**
 * calculates minimum child level
 */
function minChildLevel(node) {
  if (!node.children.length) return null;
  return Math.min(...node.children.map((child) => child.level));
}

/* sectionTag will be used in <component :is="sectionTag"> */
const sectionTag = computed(() => (props.mode === "foot" ? "tfoot" : "thead"));
const cellTag = computed(() => (props.mode === "foot" ? "td" : "th"));

const headerRows = computed(() => {
  const root = {
    key: "__root__",
    label: "",
    level: 0,
    path: "__root__",
    children: Object.entries(props.headerTree).map(([k, v]) => buildNode(k, v, 0, "")),
  };

  const nodes = flatten(root).filter((n) => n.key !== "__root__");
  const maxLevel = Math.max(...nodes.map((n) => n.level), 1);

  const rows = Array.from({ length: maxLevel }, () => []);

  for (const n of nodes) {
    if (n.label === null || n.label === undefined) continue;

    // ✅ colspan based on visible leaves
    const visibleColspan = countVisibleLeaves(n);
    if (visibleColspan === 0) continue; // whole node hidden (all leaf children hidden)

    const colspan = visibleColspan;

    let rowspan;
    if (n.children.length) {
      // Group: normalerweise 1, aber Gap überbrücken (Kind startet später)
      const mcl = minChildLevel(n);
      rowspan = mcl ? Math.max(1, mcl - n.level) : 1;
    } else {
      // Leaf: bis zum Ende runterspannen
      rowspan = maxLevel - n.level + 1;
    }

    const endLevel = n.level + rowspan - 1;

    // Footer invert placement
    const targetLevel =
      props.mode === "foot"
        ? (maxLevel - endLevel + 1)
        : n.level;

    rows[targetLevel - 1].push({
      key: n.path, // ✅ stable key incl. path
      html: String(n.label),
      colspan,
      rowspan,
    });
  }

  return rows;
});
</script>

<template>
  <component :is="sectionTag">
    <tr
      v-for="(row, rIdx) in headerRows"
      :key="rIdx"
    >
      <component
        :is="cellTag"
        v-for="cell in row"
        :key="cell.key"
        :rowspan="cell.rowspan > 1 ? cell.rowspan : null"
        :colspan="cell.colspan > 1 ? cell.colspan : null"
      >
        <span v-html="cell.html" />
      </component>
    </tr>
  </component>
</template>
