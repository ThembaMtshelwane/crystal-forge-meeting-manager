<script setup lang="ts">
import { IRoomCreate } from "@/types/room.types";
import { reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { VForm } from "vuetify/components";
import axios from "axios";

defineExpose({
  submitForm,
});

const isLoading = ref(false);

const emit = defineEmits<{
  updated: [id: string];
}>();

const props = defineProps<{
  room: {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: string;
  };
}>();

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const formData = reactive<IRoomCreate>({
  name: props.room.name || "",
  description: props.room.description || "",
  location: props.room.location || "",
  capacity: props.room.capacity || "",
});

// --- Validation Rules ---
const rules = {
  required: (value: string) => !!value || "This field is required.",
  maxTitle: (value: string) =>
    value?.length <= 25 || "Title must be 25 characters or less.",
  maxLocation: (value: string) =>
    value?.length <= 25 || "Location must be 25 characters or less.",
  maxDescription: (value: string) =>
    value?.length <= 500 || "Description must be 500 characters or less.",
  minCapacity: (value: number) => value >= 1 || "Capacity must be at least 1.",
  maxCapacity: (value: number) => value <= 20 || "Capacity cannot exceed 20.",
};

const toast = useToast();
const ROOM_URL = "api/rooms";

async function submitForm() {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) {
    toast.error("Please correct the validation errors in the form.");
    return false;
  }

  try {
    isLoading.value = true;

    const payload: IRoomCreate = {
      name: formData.name.trim().toLowerCase(),
      description: formData.description.trim().toLowerCase(),
      location: formData.location.trim().toLowerCase(),
      capacity: String(formData.capacity),
    };

    const response = await axios.patch<{
      message: string;
    }>(`${ROOM_URL}/${props.room.id}`, payload);

    toast.success(response.data.message || "Room successfully updated!");

    // Emit the updated event with the room ID
    emit("updated", props.room.id);

    return true;
  } catch (error) {
    console.error("Room update failed:", error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        "Failed to update room. Please try again."
      : "An unexpected error occurred.";
    toast.error(errorMessage);
    return false;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="text-h6 text-center text-blue-darken-2 mb-4">Edit Room</div>
  <v-form ref="formRef" @submit.prevent class="pa-4">
    <div class="space-y-6">
      <!-- Room Name -->
      <v-text-field
        v-model="formData.name"
        :rules="[rules.required, rules.maxTitle]"
        label="Room name"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-format-title"
        placeholder="e.g. The Alfred Hall"
      />

      <!-- Room Location -->
      <v-text-field
        v-model="formData.location"
        :rules="[rules.required, rules.maxLocation]"
        label="Location"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-office-building"
        placeholder="e.g. 2nd Floor"
      />

      <!-- Room Capacity -->
      <v-text-field
        v-model.number="formData.capacity"
        :rules="[rules.required, rules.minCapacity, rules.maxCapacity]"
        label="Capacity"
        type="number"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-account-group"
        placeholder="Enter room capacity (1-20)"
        min="1"
        max="20"
      />

      <!-- Description -->
      <v-textarea
        v-model="formData.description"
        :rules="[rules.required, rules.maxDescription]"
        label="Description"
        variant="outlined"
        density="comfortable"
        rows="3"
        max-rows="6"
        prepend-inner-icon="mdi-text-box-outline"
        placeholder="Provide room details or features..."
      />
    </div>
  </v-form>
</template>

<style scoped>
.space-y-6 > * {
  margin-top: 1.5rem !important;
  margin-bottom: 0 !important;
}
.space-y-6 > :first-child {
  margin-top: 0 !important;
}
</style>
