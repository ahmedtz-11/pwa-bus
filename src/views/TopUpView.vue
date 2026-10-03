<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import { money } from "../composables/useMoney";

const { user, topUp } = useAccount();
const { show } = useToast();
const router = useRouter();
const amt = ref(10);
const method = ref("Mobile money");
const busy = ref(false);

async function pay() {
  busy.value = true;
  await topUp(amt.value, method.value);
  busy.value = false;
  show("Top up successful");
  router.push("/home");
}
</script>

<template>
  <main class="pad">
    <h2>Top up</h2>
    <div class="row">
      <div
        class="chip"
        v-for="a in [5, 10, 20, 50]"
        :key="a"
        :class="{ on: amt === a }"
        @click="amt = a"
      >
        {{ money(a) }}
      </div>
    </div>
    <input
      v-model.number="amt"
      type="number"
      inputmode="decimal"
      placeholder="Custom amount"
    />
    <h2>Pay with</h2>
    <div class="row">
      <div
        class="chip"
        :class="{ on: method === 'Mobile money' }"
        @click="method = 'Mobile money'"
      >
        📱 Mobile money
      </div>
      <div
        class="chip"
        :class="{ on: method === 'Bank card' }"
        @click="method = 'Bank card'"
      >
        💳 Bank card
      </div>
    </div>
    <button
      class="btn"
      :disabled="!(amt > 0) || user.status !== 'active' || busy"
      @click="pay"
    >
      {{ busy ? "Processing…" : "Pay " + money(amt || 0) }}
    </button>
    <p v-if="user.status !== 'active'" class="err">
      Your card is blocked. Get a new virtual card first.
    </p>
  </main>
</template>
