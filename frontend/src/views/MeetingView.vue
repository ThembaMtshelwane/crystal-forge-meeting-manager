<script setup lang="ts">
import { IMeetingResponse } from "@/types/meeting.types";
import { computed } from "vue";
import { useRouter } from "vue-router";

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
  };
}>();

const router = useRouter();

// Format date nicely
const formattedDate = computed(() => {
  return new Date(props.meeting.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<template>
  <!-- Header -->
  <div class="mb-4">
    <h1 class="text-h4 font-bold text-blue-darken-2">{{ meeting.title }}</h1>
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

  <v-divider class="my-6" />

  <!-- Action Buttons -->
  <div class="flex justify-end gap-4">
    <v-btn
      color="blue-darken-2"
      variant="flat"
      @click="router.push({ name: 'EditMeeting', params: { id: meeting.id } })"
    >
      <v-icon start icon="mdi-pencil"></v-icon>
      Edit
    </v-btn>

    <v-btn color="red-darken-2" variant="flat">
      <v-icon start icon="mdi-delete"></v-icon>
      Delete
    </v-btn>
  </div>
</template>
