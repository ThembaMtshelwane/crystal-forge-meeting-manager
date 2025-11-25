<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

// 1. Define Props to control visibility and optional title/max-width
const props = defineProps<{
  /** Controls the visibility of the dialog/modal. Use with v-model. */
  modelValue: boolean;
  /** Optional title to display at the top of the modal content. */
  title?: string;
  /** Optional maximum width for the modal card. Defaults to 600px. */
  maxWidth?: string | number;
}>();

// 2. Define Emits to update the parent component's v-model
const emit = defineEmits(["update:modelValue"]);

// 3. Computed property to manage the modal state and emit updates
const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit("update:modelValue", val);
  },
});
</script>

<template>
  <v-dialog v-model="isOpen" :max-width="maxWidth || 600" persistent>
    <v-card class="mx-auto pa-12" elevation="8" rounded="lg">
      <div
        v-if="title"
        class="text-h6 text-center text-blue-darken-2 mb-4 pt-4"
      >
        {{ title }}
      </div>

      <v-btn
        icon="mdi-close"
        size="small"
        variant="text"
        @click="isOpen = false"
        class="close-button"
      ></v-btn>

      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Styling for the close button */
.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

/* Ensure the v-card takes up the full width allowed by v-dialog */
.v-card {
  width: 100%;
}
</style>
