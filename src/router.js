import { createRouter, createWebHistory } from "vue-router";

import { useAccount } from "./stores/account";

const routes = [
  {
    path: "/",
    component: () => import("./views/WelcomeView.vue"),
  },
  {
    path: "/auth/register",
    component: () => import("./views/Register.vue"),
  },
  {
    path: "/auth/login",
    component: () => import("./views/Login.vue"),
  },
  {
    path: "/home",
    component: () => import("./views/HomeView.vue"),
    meta: { auth: true },
  },
  {
    path: "/topup",
    component: () => import("./views/TopUpView.vue"),
    meta: { auth: true },
  },
  {
    path: "/card",
    component: () => import("./views/CardView.vue"),
    meta: { auth: true },
  },
  {
    path: "/account",
    component: () => import("./views/AccountInfo.vue"),
    meta: { auth: true },
  },
  {
    path: "/settings",
    component: () => import("./views/SettingsView.vue"),
    meta: { auth: true },
  },
  {
    path: "/transactions",
    component: () => import("./views/TransactionsView.vue"),
    meta: { auth: true },
  },
  {
    path: "/faq",
    component: () => import("./views/FAQs.vue"),
    meta: { auth: true },
  },
  {
    path: "/guide",
    component: () => import("./views/UserGuide.vue"),
    meta: { auth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { user } = useAccount();

  // send unauthenticated users to welcome
  if (to.meta.auth && !user.value) {
    return "/";
  }

  // Auth/welcome pages → don't show them to logged-in users
  if (!to.meta.auth && user.value) {
    return "/home";
  }
});

export default router;
