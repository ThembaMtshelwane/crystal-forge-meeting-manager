import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// Vue Router Setup
import router from "./router";

// Vuetify Setup
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useAuthStore } from "./store/auth.store.ts";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Pinia
import { createPinia } from "pinia";

const vuetify = createVuetify({
  components,
  directives,
  // Optional: Prevent Vuetify from overriding Tailwind's layout classes
  defaults: {
    global: { ripple: false },
  },
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
const authStore = useAuthStore();

app.use(vuetify);

authStore.loadUserFromStorage();
app.use(router);
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});

app.mount("#app");
