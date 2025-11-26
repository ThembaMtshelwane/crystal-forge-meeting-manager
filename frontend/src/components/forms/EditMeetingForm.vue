<script setup lang="ts">
import { useRoomStore } from "@/store/room.store";
import { IMeetingCreate } from "@/types/meeting.types";
import {
  getDefaultEndTime,
  getDefaultStartTime,
  getToday,
} from "@/utils/date.utils";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { VForm } from "vuetify/components";
import axios from "axios";

defineExpose({
  submitForm,
});
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const emit = defineEmits<{
  (e: "updated", payload: IMeetingCreate): void;
}>();

const props = defineProps<{
  meeting?: {
    title: string;
    description: string;
    date: string;
    roomId: string;
    startTime: string;
    endTime: string;
    status: boolean;
    id: string;
  };
}>();

// Compute defaults
const defaultDate = getToday();
const defaultStart = getDefaultStartTime();
const defaultEnd = getDefaultEndTime(defaultStart);
const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);
// --- Form state ---
const formRef = ref<InstanceType<typeof VForm> | null>(null);
const formData = reactive<IMeetingCreate>({
  title: props.meeting?.title || "",
  description: props.meeting?.description || "",
  date: props.meeting?.date || defaultDate,
  startTime: props.meeting?.startTime || defaultStart,
  endTime: props.meeting?.endTime || defaultEnd,
  roomId: props.meeting?.roomId || "",
});

// --- Validation Rules (Omitted for brevity, but kept as is) ---
const rules = {
  required: (v: string) => !!v || "This field is required.",
  futureDate: (v: string) => {
    const today = new Date().toISOString().split("T")[0];
    return v >= today || "The meeting date must be today or in the future.";
  },
  timeOrder: (v: string) => {
    if (formData.startTime && v <= formData.startTime) {
      return "End time must be after start time.";
    }
    return true;
  },
  maxTitle: (v: string) =>
    v?.length <= 100 || "Title must be 100 characters or less.",
  maxDescription: (v: string) =>
    v?.length <= 500 || "Description must be 500 characters or less.",
};

const toast = useToast();
const MEETING_URL = "api/meetings"; // 👈 ADDED: Define the API URL

// --- Submit Logic ---
async function submitForm() {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) {
    toast.error("Please correct the validation errors in the form.");
    return false;
  }

  try {
    isLoading.value = true;

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    const response = await axios.patch<{
      message: string;
    }>(`${MEETING_URL}/${props.meeting?.id}`, payload);

    toast.success(response.data.message || "Meeting successfully updated!");
    emit("updated", payload);
  } catch (error) {
    console.error("Meeting update failed:", error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        "Failed to update meeting. Please try again."
      : "An unexpected error occurred.";
    toast.error(errorMessage);
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
  <div class="text-h6 text-center text-blue-darken-2 mb-4">Edit Meeting</div>
  <v-form ref="formRef" @submit.prevent class="pa-4">
    <div class="space-y-6">
      <v-text-field
        v-model="formData.title"
        :rules="[rules.required, rules.maxTitle]"
        label="Meeting Title"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-format-title"
        placeholder="e.g., Q3 Planning Session"
      />

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
/* Vuetify handles most styling, but this ensures good spacing */
.space-y-6 > * {
  margin-top: 1.5rem !important; /* Tailwind space-y-6 equivalent */
  margin-bottom: 0 !important;
}
.space-y-6 > :first-child {
  margin-top: 0 !important;
}
</style>
