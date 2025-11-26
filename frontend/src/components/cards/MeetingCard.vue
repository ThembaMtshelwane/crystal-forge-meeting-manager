<script setup lang="ts">
import { useRoomStore } from "@/store/room.store";
import { useUserStore } from "@/store/user.store";
import { useMeetingStore } from "@/store/meetings.store";
import { IMeetingResponse } from "@/types/meeting.types";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import Modal from "../ui/Modal.vue";
import MeetingView from "@/views/MeetingView.vue";

const props = defineProps<IMeetingResponse>();
const display = useDisplay();
const MAX_DESCRIPTION = computed(() => {
  if (display.mdAndUp.value) {
    return 110;
  } else if (display.smAndUp.value) {
    return 90;
  }
  return 120;
});

const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);
const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const meetingStore = useMeetingStore();

const roomForMeeting = computed(() => {
  return rooms.value.find((r) => r.id === props.roomId);
});
const meetingOrganizedBy = computed(() => {
  return users.value.find((u) => u.id === props.userId);
});

const detailsModalOpen = ref(false);

function handleMeetingDeleted(id: string) {
  // Close the modal
  detailsModalOpen.value = false;

  // Refresh the meetings list
  meetingStore.getMeetings();
}

function handleMeetingUpdated(id: string) {
  // Close the modal
  detailsModalOpen.value = false;

  // Refresh the meetings list to show updated data
  meetingStore.getMeetings();
}
</script>

<template>
  <v-card elevation="3" class="d-flex flex-column pa-4">
    <v-card-title class="capitalize!">
      {{ props.title }}
    </v-card-title>
    <v-card-subtitle class="capitalize! mb-2">
      {{ `Organized by: ${meetingOrganizedBy?.firstName} ${meetingOrganizedBy?.lastName}` }}
    </v-card-subtitle>
    <v-card-subtitle class="mb-2">
      <div class="d-flex align-center text-truncate">
        <v-icon start icon="mdi-map-marker" size="small"></v-icon>
        <span class="text-medium-emphasis"
          >{{ roomForMeeting?.name }} - {{ roomForMeeting?.location }}</span
        >
      </div>

      <div
        class="d-flex flex-col md:flex-row justify-between mt-2 max-w-[300px]"
      >
        <div class="d-flex align-center">
          <v-icon
            start
            icon="mdi-calendar"
            size="small "
            color="primary"
          ></v-icon>
          <span class="font-weight-medium">{{ props.date }}</span>
        </div>
        <div class="d-flex align-center md:justify-center">
          <span>
            <v-icon start icon="mdi-clock-outline" size="small"></v-icon>
            <span class="font-weight-bold">{{ props.startTime }}</span>
          </span>
          <span class="mx-1">-</span>
          <span>
            <span class="font-weight-bold">{{ props.endTime }}</span>
          </span>
        </div>
      </div>
    </v-card-subtitle>

    <v-divider class="mx-4"></v-divider>

    <v-card-text
      v-if="props.description"
      class="description-clamp overflow-hidden h-20"
    >
      {{
        props.description.length > MAX_DESCRIPTION
          ? props.description.substring(0, MAX_DESCRIPTION) + "..."
          : props.description
      }}
    </v-card-text>

    <v-card-text v-else class="grow text-medium-emphasis font-italic">
      No description provided.
    </v-card-text>

    <v-card-actions class="mt-auto">
      <v-btn
        class="px-4!"
        @click="detailsModalOpen = true"
        color="primary"
        variant="flat"
      >
        <v-icon start icon="mdi-eye-arrow-right"></v-icon>
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>

  <Modal v-model="detailsModalOpen" max-width="650">
    <MeetingView
      :meeting="{
        id: props.id,
        title: props.title,
        description: props.description,
        date: props.date,
        location: `${roomForMeeting?.name || 'N/A'} - ${
          roomForMeeting?.location || 'N/A'
        }`,
        roomId: props.roomId,
        organizer: meetingOrganizedBy?.username || 'Unknown',
        startTime: props.startTime,
        endTime: props.endTime,
        status: props.status,
      }"
      @deleted="handleMeetingDeleted"
      @updated="handleMeetingUpdated"
    />
  </Modal>
</template>
