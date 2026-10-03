<script setup>
import { ref } from "vue";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import VirtualCard from "../components/VirtualCard.vue";
import ConfirmSheet from "../components/ConfirmSheet.vue";

const { user, reportLost, newCard } = useAccount();
const { show } = useToast();
const confirm = ref(false);

const block = () => {
  reportLost();
  confirm.value = false;
  show("Card blocked");
};
const reissue = () => {
  newCard();
  show("New virtual card ready");
};
</script>

<template>
  <main class="pad">
    <h2>Virtual card</h2>
    <VirtualCard :user="user" />
    <p>Show this at the validator to pay your fare.</p>
    <button
      v-if="user.status === 'active'"
      class="btn dn"
      @click="confirm = true"
    >
      Report card lost
    </button>
    <button v-else class="btn" @click="reissue">Get a new virtual card</button>
    <ConfirmSheet
      v-if="confirm"
      title="Report card lost?"
      text="Your card will be blocked immediately. Your balance stays safe and moves to a new virtual card."
      confirm-label="Yes, block my card"
      @confirm="block"
      @cancel="confirm = false"
    />
  </main>
</template>
