<script setup>
import { useToast } from "../composables/useToast";
const { msg } = useToast();
</script>

<template>
  <div v-if="msg" class="toast">{{ msg }}</div>
</template>
