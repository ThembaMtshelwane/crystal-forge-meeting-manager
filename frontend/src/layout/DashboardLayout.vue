<script setup lang="ts">
import ConfirmForm from "@/components/forms/ConfirmForm.vue";
import Modal from "@/components/ui/Modal.vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import { computed, ref, watch } from "vue"; // <-- Import 'watch'
import { useDisplay } from "vuetify";

const sidebarOpen = ref(false);
const display = useDisplay();
const isPermanent = computed(() => {
  return display.mdAndUp.value;
});
const logOutModalOpen = ref(false);
const handleSuccessfulLogout = () => {
  logOutModalOpen.value = false;
  console.log("Logout complete! Modal closed.");
};
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

      <div class="w-full flex items-center pl-4 pr-8">
        <v-toolbar-title class="font-bold!">
          {{ display.smAndUp.value ? " Crystal Forge Meets" : "CTM" }}
        </v-toolbar-title>
        <v-btn @click="logOutModalOpen = true"> Logout </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <section class="pa-8">
        <router-view />
      </section>
      <Modal v-model="logOutModalOpen" max-width="600">
        <ConfirmForm action-text="Logout" @success="handleSuccessfulLogout"  @close="handleSuccessfulLogout"/>
      </Modal>
    </v-main>
  </v-app>
</template>
