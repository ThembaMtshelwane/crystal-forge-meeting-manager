<script setup lang="ts">
import { useMeetingStore } from "@/store/meetings.store";
import { useRoomStore } from "@/store/room.store";
import { IMeetingCreate } from "@/types/meeting.types";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { VForm } from "vuetify/components";

defineExpose({
  submitForm,
});

const meetingStore = useMeetingStore();
const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);

const isLoading = ref(false);

const emit = defineEmits<{
  success: [];
  updated: [id: string];
}>();

const props = defineProps<{
  meeting: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: string;
    roomId: string;
    status:boolean
  };
}>();

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const formData = reactive<IMeetingCreate>({
  title: props.meeting.title || "",
  description: props.meeting.description || "",
  startTime: props.meeting.startTime || "09:00",
  endTime: props.meeting.endTime || "10:00",
  date: props.meeting.date || "",
  roomId: props.meeting.roomId || "",
});

// --- Validation Rules ---
const rules = {
  required: (value: string) => !!value || "This field is required.",
  futureDate: (value: string) => {
    const today = new Date().toISOString().split("T")[0];
    return value >= today || "The meeting date must be today or in the future.";
  },
  timeOrder: (value: string) => {
    if (formData.startTime && value <= formData.startTime) {
      return "End time must be after the start time.";
    }
    return true;
  },
  maxTitle: (value: string) =>
    value?.length <= 100 || "Title must be 100 characters or less.",
  maxDescription: (value: string) =>
    value?.length <= 500 || "Description must be 500 characters or less.",
};

const toast = useToast();

async function submitForm() {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) {
    toast.error("Please correct the validation errors in the form.");
    return false;
  }

  try {
    isLoading.value = true;

    const payload: Partial<IMeetingCreate> = {
      title: formData.title.trim().toLowerCase(),
      description: formData.description.trim().toLowerCase(),
      startTime: formData.startTime.trim().toLowerCase(),
      endTime: formData.endTime.trim().toLowerCase(),
      date: formData.date.trim().toLowerCase(),
      roomId: formData.roomId.trim().toLowerCase(),
    };

    await meetingStore.updateMeeting(props.meeting.id, payload);

    toast.success("Meeting successfully updated!");

    // Emit events to trigger parent refresh and close modal
    emit("updated", props.meeting.id);
    emit("success");

    return true;
  } catch (error) {
    console.error("Meeting update failed:", error);
    toast.error("Failed to update meeting. Please try again.");
    return false;
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await roomStore.getRooms();
});
</script>

<template>
  <div class="text-xl sm:text-2xl! font-bold! text-blue-darken-2 mb-8">
    Edit Meeting
  </div>
  <v-form ref="formRef" @submit.prevent class="pa-4">
    <div class="space-y-6">
      <!-- Meeting Title -->
      <v-text-field
        v-model="formData.title"
        :rules="[rules.required, rules.maxTitle]"
        label="Meeting Title"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-format-title"
        placeholder="e.g., Q3 Planning Session"
      />

      <!-- Date -->
      <v-row>
        <v-col cols="12" class="py-0">
          <v-text-field
            v-model="formData.date"
            :rules="[rules.required, rules.futureDate]"
            label="Date"
            type="date"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-calendar"
          />
        </v-col>
      </v-row>

      <!-- Time Range -->
      <v-row>
        <v-col cols="12" class="py-0">
          <div class="d-flex flex-col sm:flex-row align-center">
            <v-text-field
              v-model="formData.startTime"
              :rules="[rules.required]"
              label="Start Time"
              type="time"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-clock-start"
              class="w-full mr-4 sm:mr-4"
            />
            <v-text-field
              v-model="formData.endTime"
              :rules="[rules.required, rules.timeOrder]"
              label="End Time"
              type="time"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-clock-end"
              class="w-full"
            />
          </div>
        </v-col>
      </v-row>

      <!-- Room Selection -->
      <v-select
        v-model="formData.roomId"
        :items="rooms"
        :rules="[rules.required]"
        label="Select Room"
        item-title="name"
        item-value="id"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-office-building"
        placeholder="Choose a room for the meeting"
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
        placeholder="Provide agenda details or key objectives..."
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
