<script setup lang="ts">
import MeetingCard from "@/components/cards/MeetingCard.vue";
import MeetingForm from "@/components/forms/MeetingForm.vue";
import ItemsGrid from "@/components/ui/ItemsGrid.vue";
import Modal from "@/components/ui/Modal.vue";
import { useMeetingStore } from "@/store/meetings.store";
import { useRoomStore } from "@/store/room.store";
import { useUserStore } from "@/store/user.store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const meetingStore = useMeetingStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const { meetings } = storeToRefs(meetingStore);
const addModalOpen = ref(false);
const closeModal = () => {
  addModalOpen.value = false;
};
onMounted(async () => {
  await meetingStore.getMeetings();
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
          All Meetings
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          See all of your meetings
        </p>
      </div>

      <v-divider class="mt-4"></v-divider>
    </v-col>
  </v-row>

  <v-row class="mb-2">
    <v-btn class="mr-auto!" @click="addModalOpen = true">
      Create a meeting</v-btn
    >
    <Modal v-model="addModalOpen" max-width="600">
      <MeetingForm @success="closeModal" />
    </Modal>
  </v-row>
  <!-- Meetings Grid Section -->
  <v-row>
    <v-col cols="12">
      <ItemsGrid :items="meetings">
        <template #item="{ itemData }">
          <MeetingCard v-bind="itemData" :key="itemData.id" />
        </template>
      </ItemsGrid>
    </v-col>
  </v-row>
</template>
