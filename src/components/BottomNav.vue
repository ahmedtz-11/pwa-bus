<script setup>
const tabs = [
  { to: "/home", label: "Home", icon: "🏠" },
  { to: "/topup", label: "Top up", icon: "💰" },
  { to: "/card", label: "Card", icon: "🪪" },
];
</script>
<template>
  <nav>
    <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" active-class="on">
      <span>{{ t.icon }}</span
      >{{ t.label }}
    </RouterLink>
  </nav>
</template>
