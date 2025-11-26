<script setup>

const props = defineProps({
  headline: { type: String, default: ''},
  classes: { type: String, default: ''}
})
</script>

<template>
<div class="card mb-3 shadow-sm" :class="classes">
  <div class="card-body">
    <div v-if="headline" class="card-header">{{headline}}</div>
    <slot></slot>
  </div>
</div>
</template>
