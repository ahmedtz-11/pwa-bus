<script setup>
import { useAccount } from "../stores/account";
import { useRouter } from "vue-router";
import BalanceHero from "../components/BalanceHero.vue";
import TxList from "../components/TxList.vue";
const { user, signOut } = useAccount();
const router = useRouter();
const logout = () => {
  signOut();
  router.replace("/");
};
</script>

<template>
  <main class="pad">
    <div class="top">
      <div>
        <small class="muted">Hello,</small>
        <h1 style="margin: 0">{{ user.name.split(" ")[0] }}</h1>
      </div>
      <button class="link" @click="logout">Log out</button>
    </div>
    <BalanceHero :user="user" />
    <div class="row">
      <RouterLink class="btn" style="flex: 1" to="/topup">＋ Top up</RouterLink>
      <RouterLink class="btn alt" style="flex: 1" to="/card">Card</RouterLink>
    </div>
    <h2>Recent activity</h2>
    <TxList :items="user.tx.slice(0, 8)" />
  </main>
</template>
