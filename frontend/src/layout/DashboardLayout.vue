/src/layout/DashboardLayout.vue
<script setup lang="ts">
import Sidebar from "@/components/ui/Sidebar.vue";
import { computed, ref, watch } from "vue"; // <-- Import 'watch'
import { useDisplay } from "vuetify";

const sidebarOpen = ref(false);
const display = useDisplay();
const isPermanent = computed(() => {
  return display.mdAndUp.value;
});

// Watch for screen size change and force sidebar open when permanent
watch(
  isPermanent,
  (newVal) => {
    if (newVal) {
      sidebarOpen.value = true;
    }
  },
  { immediate: true }
); // <-- Set immediate: true to initialize on load
</script>

<template>
  <v-app>
    <Sidebar v-model="sidebarOpen" />

    <v-app-bar>
      <v-app-bar-nav-icon
        v-if="!isPermanent"
        @click="sidebarOpen = !sidebarOpen"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="font-bold!">
        Crystal Forge Meets
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <section class="pa-8">
        <router-view />
      </section>
    </v-main>
  </v-app>
</template>
