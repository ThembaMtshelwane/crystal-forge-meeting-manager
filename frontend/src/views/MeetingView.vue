<script setup lang="ts">
import { computed, ref } from "vue";
import EditMeetingForm from "@/components/forms/EditMeetingForm.vue";
import { IMeetingCreate } from "@/types/meeting.types";
import axios from "axios";
import { useToast } from "vue-toastification";
import ConfirmForm from "@/components/forms/ConfirmForm.vue";
import Modal from "@/components/ui/Modal.vue";

const props = defineProps<{
  meeting: {
    title: string;
    description: string;
    date: string;
    location: string;
    organizer: string;
    startTime: string;
    endTime: string;
    status: boolean;
    id: string;
    roomId: string;
  };
}>();

const emit = defineEmits<{
  deleted: [id: string];
  updated: [id: string];
}>();

const editFormRef = ref<InstanceType<typeof EditMeetingForm> | null>(null);

const isEditable = ref(false);
const isConfirmingDelete = ref(false);
const isLoadingDelete = ref(false);

const toast = useToast();
const MEETING_URL = "api/meetings";

// Format date nicely
const formattedDate = computed(() => {
  return new Date(props.meeting.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

function handleUpdated(id: string) {
  isEditable.value = false;
  // Emit the updated event to parent
  emit("updated", id);
}

async function deleteMeeting() {
  if (!props.meeting.id) {
    toast.error("Cannot delete: Meeting ID is missing.");
    isConfirmingDelete.value = false;
    return;
  }

  isLoadingDelete.value = true;

  try {
    const response = await axios.delete<{
      message: string;
    }>(`${MEETING_URL}/${props.meeting.id}`);

    toast.success(response.data.message || "Meeting successfully deleted!");

    // Close the modal and confirmation form
    isConfirmingDelete.value = false;

    // Emit the deleted event to parent
    emit("deleted", props.meeting.id);
  } catch (error) {
    console.error("Meeting deletion failed:", error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        "Failed to delete meeting. Please try again."
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
      :actionText="`deleting the meeting: ${props.meeting.title}`"
      actionColor="red-darken-2"
      buttonText="Delete"
      @close="isConfirmingDelete = false"
      @success="deleteMeeting"
      :is-loading="isLoadingDelete"
    />
  </Modal>

  <!-- Meeting View/Edit Content -->
  <section v-if="!isEditable">
    <div class="mb-4">
      <h1 class="text-h4 font-bold text-primary">{{ meeting.title }}</h1>
      <p class="text-medium-emphasis mt-1">
        Created by <strong>{{ meeting.organizer }}</strong>
      </p>
    </div>

    <v-divider />

    <!-- Details Section -->
    <div class="mt-5 space-y-4">
      <!-- Date -->
      <div class="flex items-center gap-3">
        <v-icon icon="mdi-calendar" size="28"></v-icon>
        <div>
          <p class="font-semibold">Date</p>
          <p class="text-medium-emphasis">{{ formattedDate }}</p>
        </div>
      </div>

      <!-- Time -->
      <div class="flex items-center gap-3">
        <v-icon icon="mdi-clock-outline" size="28"></v-icon>
        <div>
          <p class="font-semibold">Time</p>
          <p class="text-medium-emphasis">
            {{ meeting.startTime }} — {{ meeting.endTime }}
          </p>
        </div>
      </div>

      <!-- Location -->
      <div class="flex items-center gap-3">
        <v-icon icon="mdi-map-marker" size="28"></v-icon>
        <div>
          <p class="font-semibold">Location</p>
          <p class="text-medium-emphasis capitalize">{{ meeting.location }}</p>
        </div>
      </div>

      <!-- Status -->
      <div class="flex items-center gap-3">
        <v-icon
          :icon="meeting.status ? 'mdi-check-circle' : 'mdi-close-circle'"
          :color="meeting.status ? 'green' : 'red'"
          size="28"
        />
        <div>
          <p class="font-semibold">Status</p>
          <p :class="meeting.status ? 'text-green' : 'text-red'">
            {{ meeting.status ? "Active" : "Cancelled" }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <div>
        <p class="font-semibold mb-1">Description</p>
        <p class="text-medium-emphasis whitespace-pre-wrap">
          {{ meeting.description || "No description provided." }}
        </p>
      </div>
    </div>
  </section>

  <section v-else>
    <EditMeetingForm
      ref="editFormRef"
      :meeting="{
        id: props.meeting.id,
        title: props.meeting.title,
        description: props.meeting.description,
        date: props.meeting.date,
        roomId: props.meeting.roomId,
        startTime: props.meeting.startTime,
        endTime: props.meeting.endTime,
        status: props.meeting.status,
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
