<script setup lang="ts">
import { useMeetingStore } from "@/store/meetings.store";
import { useRoomStore } from "@/store/room.store";
import { IMeetingCreate } from "@/types/meeting.types";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { VForm } from "vuetify/components";

// --- Meeting creation logic ---
const meeetingStore = useMeetingStore();
const emit = defineEmits(["success", "close"]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// References for form state and validation
const formRef = ref<InstanceType<typeof VForm> | null>(null);
const formData = reactive<IMeetingCreate>({
  title: "",
  description: "",
  startTime: "09:00",
  endTime: "10:00",
  date: "", // YYYY-MM-DD
  roomId: "",
});
const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);

// --- Validation Rules ---
const rules = {
  required: (value: string) => !!value || "This field is required.",
  futureDate: (value: string) => {
    const today = new Date().toISOString().split("T")[0];
    return value >= today || "The meeting date must be today or in the future.";
  },
  timeOrder: (value: string) => {
    // This rule assumes it's applied to the endTime field
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

// --- Submission Logic ---

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
      title: formData.title.trim().toLowerCase(),
      description: formData.description.trim().toLowerCase(),
      startTime: formData.startTime.trim().toLowerCase(),
      endTime: formData.endTime.trim().toLowerCase(),
      date: formData.date.trim().toLowerCase(),
      roomId: formData.roomId.trim().toLowerCase(),
    };
    const res = await meeetingStore.createMeeting(payload);

    toast.success(
      (res?.message as string) || "Meeting successfully scheduled!"
    );

    // Reset form after successful creation
    formRef.value?.reset();

    // Emit success to trigger parent refresh and close modal
    emit("success");
  } catch (error) {
    console.error("Meeting creation failed:", error);
    toast.error("Failed to schedule meeting. Please try again.");
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
    Create A New Meeting
  </div>
  <!-- Vuetify Form Wrapper with Validation Ref -->
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

      <!-- Date, Start Time, and End Time on the same row -->
      <v-row>
        <!-- Date Picker -->
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
        <!-- Time Range -->
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

    <v-btn
      :loading="isLoading"
      color="blue-darken-2"
      variant="flat"
      size="large"
      block
      class="mt-6"
      @click="submitForm"
    >
      Schedule Meeting
    </v-btn>
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
