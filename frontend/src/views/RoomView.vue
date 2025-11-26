<script setup lang="ts">
import { ref } from "vue";
import EditRoomForm from "@/components/forms/EditRoomForm.vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import ConfirmForm from "@/components/forms/ConfirmForm.vue";
import Modal from "@/components/ui/Modal.vue";

const props = defineProps<{
  room: {
    id: string;
    name: string;
    description: string;
    location: string;
    capacity: string;
  };
}>();

const emit = defineEmits<{
  deleted: [id: string];
  updated: [id: string];
}>();

const editFormRef = ref<InstanceType<typeof EditRoomForm> | null>(null);

const isEditable = ref(false);
const isConfirmingDelete = ref(false);
const isLoadingDelete = ref(false);

const toast = useToast();
const ROOM_URL = "api/rooms";

function handleUpdated(id: string) {
  isEditable.value = false;
  // Emit the updated event to parent
  emit("updated", id);
}

async function deleteRoom() {
  if (!props.room.id) {
    toast.error("Cannot delete: Room ID is missing.");
    isConfirmingDelete.value = false;
    return;
  }

  isLoadingDelete.value = true;

  try {
    const response = await axios.delete<{
      message: string;
    }>(`${ROOM_URL}/${props.room.id}`);

    toast.success(response.data.message || "Room successfully deleted!");

    // Close the modal and confirmation form
    isConfirmingDelete.value = false;

    // Emit the deleted event to parent
    emit("deleted", props.room.id);
  } catch (error) {
    console.error("Room deletion failed:", error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        "Failed to delete room. Please try again."
      : "An unexpected error occurred during deletion.";
    toast.error(errorMessage);
  } finally {
    isLoadingDelete.value = false;
  }
}
</script>

<template>
  <Modal
    v-model="isConfirmingDelete"
    title="Confirmation Required"
    max-width="500"
  >
    <ConfirmForm
      :actionText="`deleting the room: ${props.room.name}`"
      actionColor="red-darken-2"
      buttonText="Delete Room"
      @close="isConfirmingDelete = false"
      @success="deleteRoom"
      :is-loading="isLoadingDelete"
    />
  </Modal>

  <!-- Room View/Edit Content -->
  <section v-if="!isEditable">
    <div class="mb-4">
      <h1 class="text-h4 font-bold text-primary capitalize">
        {{ room.name }}
      </h1>
    </div>

    <v-divider />

    <!-- Details Section -->
    <div class="mt-5 space-y-4">
      <!-- Location -->
      <div class="flex items-center gap-3">
        <v-icon icon="mdi-map-marker" size="28" color="primary"></v-icon>
        <div>
          <p class="font-semibold">Location</p>
          <p class="text-medium-emphasis capitalize">{{ room.location }}</p>
        </div>
      </div>

      <!-- Capacity -->
      <div class="flex items-center gap-3">
        <v-icon
          icon="mdi-account-group"
          size="28"
          color="primary"
        ></v-icon>
        <div>
          <p class="font-semibold">Capacity</p>
          <p class="text-medium-emphasis">{{ room.capacity }} people</p>
        </div>
      </div>

      <!-- Description -->
      <div>
        <p class="font-semibold mb-1">Description</p>
        <p class="text-medium-emphasis whitespace-pre-wrap capitalize">
          {{ room.description || "No description provided." }}
        </p>
      </div>
    </div>
  </section>

  <section v-else>
    <EditRoomForm
      ref="editFormRef"
      :room="{
        id: props.room.id,
        name: props.room.name,
        description: props.room.description,
        location: props.room.location,
        capacity: props.room.capacity,
      }"
      @updated="handleUpdated"
    />
  </section>

  <v-divider class="my-6" />

  <!-- Action Buttons -->
  <div class="flex justify-end gap-4">
    <v-btn
      @click="isEditable ? editFormRef?.submitForm() : (isEditable = true)"
      color="primary"
      variant="flat"
    >
      <v-icon v-if="!isEditable" start icon="mdi-pencil"></v-icon>
      {{ isEditable ? "Save" : "Edit" }}
    </v-btn>

    <v-btn
      @click="isConfirmingDelete = true"
      color="red-darken-2"
      variant="flat"
      :loading="isLoadingDelete"
      :disabled="isEditable"
    >
      <v-icon start icon="mdi-delete"></v-icon>
      Delete
    </v-btn>
  </div>
</template>

<style scoped>
.space-y-4 > * {
  margin-top: 1rem !important;
  margin-bottom: 0 !important;
}
.space-y-4 > :first-child {
  margin-top: 0 !important;
}
</style>
