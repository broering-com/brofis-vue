<script setup>
import { computed } from "vue";

/**
 * headerTree Format:
 * {
 *   key: { label?: string, level?: number, order?: [], children?: { ... } }
 * }
 */

const props = defineProps({
  headerTree: { type: Object, required: true },
});

function isObj(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function childEntries(node) {
  const ch = node?.children;
  if (!isObj(ch)) return [];
  const keys = Object.keys(ch);

  if (Array.isArray(node.order) && node.order.length) {
    const set = new Set(node.order);
    return [
      ...node.order.filter((k) => keys.includes(k)).map((k) => [k, ch[k]]),
      ...keys.filter((k) => !set.has(k)).map((k) => [k, ch[k]]),
    ];
  }
  return keys.map((k) => [k, ch[k]]);
}

function buildNode(key, nodeLike, parentLevel) {
  const node = isObj(nodeLike) ? nodeLike : {};
  const level = node.level ?? (parentLevel + 1);
  const label = node.label ?? key;

  const children = childEntries(node).map(([ck, cn]) =>
    buildNode(ck, cn, level)
  );

  return { key, label, level, children };
}

function flatten(root) {
  const out = [];
  (function walk(n) {
    out.push(n);
    n.children.forEach(walk);
  })(root);
  return out;
}

function countLeaves(n) {
  if (!n.children.length) return 1;
  return n.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

function minChildLevel(n) {
  if (!n.children.length) return null;
  return Math.min(...n.children.map((c) => c.level));
}

const headerRows = computed(() => {
  const root = {
    key: "__root__",
    label: "",
    level: 0,
    children: Object.entries(props.headerTree).map(([k, v]) =>
      buildNode(k, v, 0)
    ),
  };

  const nodes = flatten(root).filter((n) => n.key !== "__root__");
  const maxLevel = Math.max(...nodes.map((n) => n.level), 1);

  const rows = Array.from({ length: maxLevel }, () => []);

  for (const n of nodes) {
    if (n.label === null || n.label === undefined) continue;

    const colspan = countLeaves(n);

    let rowspan;
    if (!n.children.length) {
      // Leaf: span bis zur letzten Zeile
      rowspan = maxLevel - n.level + 1;
    } else {
      // Group: normalerweise 1, aber „Gap“ überbrücken wenn Kinder erst später starten
      const mcl = minChildLevel(n);
      rowspan = mcl ? Math.max(1, mcl - n.level) : 1;
    }

    rows[n.level - 1].push({
      key: n.key,
      html: String(n.label),
      colspan,
      rowspan,
    });
  }

  return rows;
});
</script>

<template>
  <thead>
    <tr
      v-for="(row, rIdx) in headerRows"
      :key="rIdx"
    >
      <th
        v-for="cell in row"
        :key="cell.key"
        :rowspan="cell.rowspan > 1 ? cell.rowspan : null"
        :colspan="cell.colspan > 1 ? cell.colspan : null"
        v-html="cell.html"
      />
    </tr>
  </thead>
</template>
