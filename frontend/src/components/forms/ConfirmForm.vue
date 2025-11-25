<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { defineProps, defineEmits } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

// --- Sign up logic ---
const authStore = useAuthStore();
const emit = defineEmits(["success", "close"]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const props = defineProps<{
  /** The specific action the user is confirming (e.g., 'deleting user X', 'logging out'). */
  actionText: string;
  /** The color of the main action button (defaults to red for destructive actions). */
  actionColor?: string;
  /** The text displayed on the action button (defaults to 'Confirm'). */
  buttonText?: string;
}>();

// --- Routing ----
const router = useRouter();

const handleConfirm = async () => {
  // clear prev errors
  errorMessage.value = null;
  authStore.clearError();

  try {
    isLoading.value = true;
    const res = await authStore.logout();
    router.push({ name: "Home" });
    emit("success");
  } catch (error) {
    errorMessage.value =
      authStore.error || "An unknown error occurred during logging out.";
    //#TODO: Add toastify
    console.error("❌ Logout failed:", errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handles cancellation
 */
const handleCancel = () => {
  emit("close");
};
</script>

<template>
  <div class="text-h6 text-center text-blue-darken-2 mb-4">
    Confirmation Required
  </div>

  <v-card-text class="text-center pb-8">
    <v-icon
      icon="mdi-alert-circle-outline"
      size="64"
      :color="actionColor || 'red-darken-1'"
      class="mb-4"
    ></v-icon>
    <div class="text-subtitle-1 text-medium-emphasis mb-2">
      Are you sure you want to proceed with
      <span class="font-weight-bold">{{ props.actionText }}</span
      >?
    </div>
  </v-card-text>

  <v-row class="pa-3">
    <v-col cols="6" class="pr-1">
      <v-btn
        @click="handleCancel"
        class="mb-4"
        color="grey"
        size="large"
        variant="tonal"
        block
        :disabled="isLoading"
      >
        Cancel
      </v-btn>
    </v-col>

    <v-col cols="6" class="pl-1">
      <v-btn
        @click="handleConfirm"
        class="mb-4"
        :color="actionColor || 'red'"
        size="large"
        variant="flat"
        block
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ buttonText || "Confirm" }}
      </v-btn>
    </v-col>
  </v-row>
</template>
