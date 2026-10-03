import { ref } from "vue";

const msg = ref("");
export function useToast() {
  const show = (m) => {
    msg.value = m;
    setTimeout(() => (msg.value = ""), 2200);
  };
  return { msg, show };
}
