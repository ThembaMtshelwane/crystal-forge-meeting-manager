<script setup lang="ts">
import ConfirmForm from "@/components/forms/ConfirmForm.vue";
import Modal from "@/components/ui/Modal.vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const sidebarOpen = ref(false);
const display = useDisplay();
const isPermanent = computed(() => {
  return display.mdAndUp.value;
});

// Logout Logic
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const logOutModalOpen = ref(false);
const isLoggingOut = ref(false);

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

    <v-app-bar elevation="2" class="border-b border-blue-100">
      <v-app-bar-nav-icon
        v-if="!isPermanent"
        @click="sidebarOpen = !sidebarOpen"
        color="primary"
      ></v-app-bar-nav-icon>

      <div class="w-full flex items-center justify-between px-4">
        <v-toolbar-title class="font-bold text-blue-900">
          {{ display.smAndUp.value ? "Crystal Forge Meets" : "CFM" }}
        </v-toolbar-title>

        <v-btn
          @click="logOutModalOpen = true"
          color="blue-grey-darken-1"
          variant="outlined"
          prepend-icon="mdi-logout"
        >
          Logout
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="bg-linear-to-br from-blue-50 to-blue-100">
      <section class="pa-8">
        <router-view />
      </section>

      <!-- Modal for Logout Confirmation -->
      <Modal v-model="logOutModalOpen" title="Confirm Logout" max-width="448">
        <ConfirmForm
          action-text="logging out of your account"
          action-color="blue-grey-darken-1"
          button-text="Log Out"
          @success="handleLogout"
          @close="logOutModalOpen = false"
          :is-loading="isLoggingOut"
        />
      </Modal>
    </v-main>
  </v-app>
</template>
