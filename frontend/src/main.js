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

const pinia = createPinia();
const app = createApp(App);

app.use(vuetify);
app.use(router);
app.use(pinia);

app.mount("#app");
