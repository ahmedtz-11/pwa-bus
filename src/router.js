import { createRouter, createWebHistory } from "vue-router";
import { useAccount } from "./stores/account";

const routes = [
  { path: "/", component: () => import("./views/WelcomeView.vue") },
  {
    path: "/auth/:mode(link|register|signin)",
    component: () => import("./views/AuthView.vue"),
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
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const { user } = useAccount();
  if (to.meta.auth && !user.value) return "/";
  if (!to.meta.auth && user.value) return "/home";
});

export default router;
