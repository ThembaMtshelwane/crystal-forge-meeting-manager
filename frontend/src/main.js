import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// Vuetify Setup
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  // Optional: Prevent Vuetify from overriding Tailwind's layout classes
  defaults: {
    global: { ripple: false },
  },
});

const app = createApp(App);
app.use(vuetify);

app.mount("#app");
