<script setup>
import { computed } from "vue";
const props = defineProps({ user: Object });
const number = computed(() =>
  props.user.cardNo.replace(/(.{4})/g, "$1 ").trim(),
);
const bars = computed(() =>
  Array.from(
    { length: 40 },
    (_, i) => 1 + ((+props.user.cardNo[i % 16] + i) % 3),
  ),
);
</script>

<template>
  <div class="vc" :class="{ blocked: user.status !== 'active' }">
    <span class="tag">{{
      user.status === "active" ? "Active" : "Blocked"
    }}</span>
    <b>BusGo</b>
    <div>
      <div class="num">{{ number }}</div>
      <div class="bars">
        <i v-for="(w, i) in bars" :key="i" :style="{ width: w + 'px' }"></i>
      </div>
    </div>
    <div class="between">
      <span>{{ user.name }}</span
      ><span>{{ user.physical ? "Linked card" : "Virtual" }}</span>
    </div>
  </div>
</template>
