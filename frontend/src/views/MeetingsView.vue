<script setup lang="ts">
import MeetingCard from "@/components/cards/MeetingCard.vue";
import MeetingForm from "@/components/forms/MeetingForm.vue";
import ItemsGrid from "@/components/ui/ItemsGrid.vue";
import Modal from "@/components/ui/Modal.vue";
import { useMeetingStore } from "@/store/meetings.store";
import { useRoomStore } from "@/store/room.store";
import { useUserStore } from "@/store/user.store";
import { useAuthStore } from "@/store/auth.store";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const meetingStore = useMeetingStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const { meetings, userMeetings } = storeToRefs(meetingStore);
const addModalOpen = ref(false);
const showMyMeetingsOnly = ref(true);

const user = computed(() => authStore.currentUser);
const isAdmin = computed(() => user.value?.role === 'admin');

// Computed property to show either all meetings or user's meetings
const displayedMeetings = computed(() => {
  return showMyMeetingsOnly.value ? userMeetings.value : meetings.value;
});

const closeModal = async () => {
  addModalOpen.value = false;
  // Refresh the appropriate meetings list after creating a new meeting
  if (showMyMeetingsOnly.value) {
    await meetingStore.getLoggedInUserMeetings();
  } else {
    await meetingStore.getMeetings();
  }
};

const toggleMeetingsView = async () => {
  showMyMeetingsOnly.value = !showMyMeetingsOnly.value;
  if (showMyMeetingsOnly.value) {
    await meetingStore.getLoggedInUserMeetings();
  } else {
    await meetingStore.getMeetings();
  }
};

onMounted(async () => {
  // Load user's meetings first
  await meetingStore.getLoggedInUserMeetings();
  
  // If admin, also load all meetings for when they toggle
  if (isAdmin.value) {
    await meetingStore.getMeetings();
  }
  
  await roomStore.getRooms();
  await userStore.getUsers();
});
</script>

<template>
  <!-- Header Section -->
  <v-row>
    <v-col cols="12">
      <div>
        <h1 class="text-h4 font-weight-bold text-blue-darken-2">
          {{ showMyMeetingsOnly ? 'My Meetings' : 'All Meetings' }}
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          {{ showMyMeetingsOnly ? 'View your scheduled meetings' : 'See all meetings in the organization' }}
        </p>
      </div>

      <v-divider class="mt-4"></v-divider>
    </v-col>
  </v-row>

  <v-row class="mb-2">
    <v-btn class="mr-2" @click="addModalOpen = true">
      Create a meeting
    </v-btn>
    
    <v-btn 
    v-if="isAdmin"
      :color="showMyMeetingsOnly ? 'primary' : 'default'"
      @click="toggleMeetingsView"
      variant="outlined"
    >
      {{ showMyMeetingsOnly ? 'Show All Meetings' : 'Show My Meetings' }}
    </v-btn>

    <Modal v-model="addModalOpen" max-width="600">
      <MeetingForm @success="closeModal" />
    </Modal>
  </v-row>

  <!-- Meetings Grid Section -->
  <v-row>
    <v-col cols="12">
      <ItemsGrid :items="displayedMeetings">
        <template #item="{ itemData }">
          <MeetingCard v-bind="itemData" :key="itemData.id" />
        </template>
      </ItemsGrid>
    </v-col>
  </v-row>
</template>