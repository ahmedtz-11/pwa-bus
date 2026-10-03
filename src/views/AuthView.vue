<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";

const route = useRoute(),
  router = useRouter();
const { signUp, signIn } = useAccount();
const { show } = useToast();
const mode = computed(() => route.params.mode);
const f = reactive({ card: "", name: "", phone: "", pass: "" });
const err = ref("");

const titles = {
  link: "Link your card",
  register: "Create account",
  signin: "Sign in",
};
const cta = {
  link: "Link card & continue",
  register: "Register",
  signin: "Sign in",
};

function submit() {
  err.value = "";
  try {
    if (mode.value === "signin") signIn(f.phone, f.pass);
    else signUp({ ...f, card: mode.value === "link" ? f.card : undefined });
    show("Welcome aboard!");
    router.replace("/home");
  } catch (e) {
    err.value = e.message;
  }
}
</script>

<template>
  <main class="pad">
    <RouterLink class="link" to="/">← Back</RouterLink>
    <h1>{{ titles[mode] }}</h1>
    <p v-if="mode === 'link'">
      Enter the number printed on your physical card to link it to a new
      account.
    </p>
    <p v-if="mode === 'register'">
      We'll issue you a free virtual card instantly.
    </p>
    <input
      v-if="mode === 'link'"
      v-model="f.card"
      inputmode="numeric"
      maxlength="16"
      placeholder="16-digit card number"
    />
    <input
      v-if="mode !== 'signin'"
      v-model="f.name"
      placeholder="Full name"
      autocomplete="name"
    />
    <input
      v-model="f.phone"
      inputmode="tel"
      placeholder="Phone number"
      autocomplete="tel"
    />
    <input
      v-model="f.pass"
      type="password"
      placeholder="Password (min 6 characters)"
    />
    <div class="err" v-if="err">{{ err }}</div>
    <button class="btn" @click="submit">{{ cta[mode] }}</button>
  </main>
</template>
