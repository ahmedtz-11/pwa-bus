<script setup>
import { useAccount } from "../stores/account";

const { hasAccount } = useAccount();
</script>

<template>
  <main class="pad">
    <div style="font-size: 48px; margin-top: 40px">🚌</div>
    <h1>BusGo</h1>
    <p>Top up, ride, and manage your bus card from your phone.</p>
    <RouterLink class="btn" to="/auth/link">I have a physical card</RouterLink>
    <RouterLink class="btn alt" to="/auth/register"
      >I don't have a card — register</RouterLink
    >
    <RouterLink v-if="hasAccount" class="link" to="/auth/signin"
      >Already have an account? Sign in</RouterLink
    >
  </main>
</template>
