<script setup lang="ts">
import { useRoomStore } from "@/store/room.store";
import { IRoomCreate } from "@/types/room.types";
import { reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { VForm } from "vuetify/components";

const roomStore = useRoomStore();
const emit = defineEmits<{
  success: [id?: string];
  close: [];
}>();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const formData = reactive<IRoomCreate>({
  name: "",
  description: "",
  location: "",
  capacity: "",
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

const handleSubmit = async () => {
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

    const res = await roomStore.createRoom(payload);
    if (res) {
      toast.success("Room successfully created!");
      formRef.value?.reset();
      // Emit success with the room ID if available
      emit("success", res.id);
    }
  } catch (error) {
    console.error("Room creation failed:", error);
    toast.error("Failed to create a room. Please try again.");
    return false;
  } finally {
    isLoading.value = false;
  }
};

defineExpose({
  handleSubmit,
});
</script>

<template>
  <div class="text-h6 text-center text-blue-darken-2 mb-4">
    Create A New Room
  </div>
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

    <v-btn
      :loading="isLoading"
      color="blue-darken-2"
      variant="flat"
      size="large"
      block
      class="mt-6"
      @click="handleSubmit"
    >
      Create a Room
    </v-btn>
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