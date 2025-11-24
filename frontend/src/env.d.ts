// src/env.d.ts

/// <reference types="vite/client" />
// The line above imports the types for import.meta.env

// Your existing .vue module declaration should also be here:
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
