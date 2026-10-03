<script setup>
import { money } from "../composables/useMoney";

defineProps({ items: Array });
</script>

<template>
  <div class="card">
    <div v-if="!items.length" class="muted">No activity yet.</div>
    <div class="tx" v-for="t in items" :key="t.id">
      <div>
        {{ t.label }}<br /><small class="muted">{{ t.date }}</small>
      </div>
      <span :class="{ pos: t.amt > 0 }"
        >{{ t.amt > 0 ? "+" : "" }}{{ money(t.amt) }}</span
      >
    </div>
  </div>
</template>
