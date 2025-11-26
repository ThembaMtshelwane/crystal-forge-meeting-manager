<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import { ref } from "vue";
import { useToast } from "vue-toastification"; // Import toast for local error handling if needed

// --- Component Setup ---
// Define Emits: 'success' tells the parent to execute the action; 'close' tells the parent to close the modal.
const emit = defineEmits(["success", "close"]);

// Local state for basic loading/error handling, though we prefer the parent handles the main loading state
const localIsLoading = ref(false);
const toast = useToast();

const props = defineProps<{
  /** The specific action the user is confirming (e.g., 'deleting the meeting', 'logging out'). */
  actionText: string;
  /** The color of the main action button (defaults to red for destructive actions). */
  actionColor?: string;
  /** The text displayed on the action button (defaults to 'Confirm'). */
  buttonText?: string;
  /** The loading state passed from the parent component, used to disable the buttons. */
  isLoading?: boolean;
}>();

/**
 * Handles confirmation click. It emits 'success' to the parent, 
 * which is responsible for executing the actual action (e.g., API call).
 */
const handleConfirm = () => {
  if (props.isLoading) return; // Prevent double click if parent loading prop is true
  // We use localIsLoading to prevent immediate re-clicks before parent takes over
  // For a truly generic form, we just emit the success event.
  emit("success");
};

/**
 * Handles cancellation
 */
const handleCancel = () => {
  emit("close");
};

// Computed property for the combined loading state
const combinedIsLoading = computed(() => props.isLoading || localIsLoading.value);

</script>

<template>
  <v-card-text class="text-center pb-8">
    <v-icon
      icon="mdi-alert-circle-outline"
      size="64"
      :color="props.actionColor || 'red-darken-1'"
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
        :disabled="combinedIsLoading"
      >
        Cancel
      </v-btn>
    </v-col>

    <v-col cols="6" class="pl-1">
      <v-btn
        @click="handleConfirm"
        class="mb-4"
        :color="props.actionColor || 'red'"
        size="large"
        variant="flat"
        block
        :loading="combinedIsLoading"
        :disabled="combinedIsLoading"
      >
        {{ props.buttonText || "Confirm" }}
      </v-btn>
    </v-col>
  </v-row>
</template>