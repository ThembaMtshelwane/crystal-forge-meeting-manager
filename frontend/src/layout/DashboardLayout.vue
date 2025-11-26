<script setup lang="ts">
import ConfirmForm from "@/components/forms/ConfirmForm.vue";
import Modal from "@/components/ui/Modal.vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useAuthStore } from "@/store/auth.store"; // 👈 NEW: Import auth store
import { useRouter } from "vue-router"; // 👈 NEW: Import router
import { useToast } from "vue-toastification"; // 👈 NEW: Import toast for feedback

const sidebarOpen = ref(false);
const display = useDisplay();
const isPermanent = computed(() => {
  return display.mdAndUp.value;
});

// --- Logout Logic State and Hooks ---
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const logOutModalOpen = ref(false);
const isLoggingOut = ref(false); // 👈

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await authStore.logout();
    toast.success("Successfully logged out!");
    router.push({ name: "Home" });
  } catch (error) {
    console.error("❌ Logout failed:", error);
    toast.error("Logout failed. Please try again.");
  } finally {
    isLoggingOut.value = false;
    logOutModalOpen.value = false;
  }
};

watch(
  isPermanent,
  (newVal) => {
    if (newVal) {
      sidebarOpen.value = true;
    }
  },
  { immediate: true }
);
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

      <!-- Modal for Logout Confirmation -->
      <Modal v-model="logOutModalOpen" title="Logout" max-width="600">
        <ConfirmForm
          action-text="logging out of your account"
          action-color="red"
          button-text="Log Out"
          @success="handleLogout"
          @close="logOutModalOpen = false"
          :is-loading="isLoggingOut"
        />
      </Modal>
    </v-main>
  </v-app>
</template>
