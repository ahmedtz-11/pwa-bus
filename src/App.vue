<script setup>
import { useRoute } from "vue-router";
import BottomNav from "./components/BottomNav.vue";
const route = useRoute();
</script>

<template>
  <div class="shell">
    <RouterView />
    <!-- <BottomNav v-if="route.meta.auth" /> -->
  </div>
</template>
