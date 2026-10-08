<script setup>
import { useRoute } from "vue-router";
import BottomNav from "./components/BottomNav.vue";
import ToastMessage from "./components/ToastMessage.vue";
const route = useRoute();
</script>

<template>
  <div class="shell">
    <ToastMessage />
    <RouterView />
    <!-- <BottomNav v-if="route.meta.auth" /> -->
  </div>
</template>
