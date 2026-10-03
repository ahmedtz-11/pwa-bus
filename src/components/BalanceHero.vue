<script setup>
import { money } from "../composables/useMoney";
defineProps({ user: Object });
</script>

<template>
  <div class="hero">
    <small>Balance</small><b>{{ money(user.balance) }}</b>
    <small
      >Card •••• {{ user.cardNo.slice(-4) }} ·
      {{ user.status === "active" ? "Active" : "Blocked" }}</small
    >
  </div>
</template>
