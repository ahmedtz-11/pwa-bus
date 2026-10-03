<script setup>
defineProps({ title: String, text: String, confirmLabel: String });
defineEmits(["confirm", "cancel"]);
</script>

<template>
  <div class="modal" @click.self="$emit('cancel')">
    <div class="sheet">
      <h2 style="margin-top: 0">{{ title }}</h2>
      <p>{{ text }}</p>
      <button class="btn dn" @click="$emit('confirm')">
        {{ confirmLabel }}
      </button>
      <button class="btn alt" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>
