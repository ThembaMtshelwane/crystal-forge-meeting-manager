<script setup lang="ts">
import RoomCard from "@/components/cards/RoomCard.vue";
import RoomForm from "@/components/forms/RoomForm.vue";
import ItemsGrid from "@/components/ui/ItemsGrid.vue";
import Modal from "@/components/ui/Modal.vue";
import { useRoomStore } from "@/store/room.store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);
const addModalOpen = ref(false);
const closeModal = () => {
  addModalOpen.value = false;
};
onMounted(async () => {
  await roomStore.getRooms();
});
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Header Section -->
    <v-row>
      <v-col cols="12">
        <div>
          <h1 class="text-h4 font-weight-bold text-blue-darken-2">All Rooms</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            See all available rooms un your organization
          </p>
        </div>

        <v-divider class="mt-4"></v-divider>
      </v-col>
    </v-row>

    <v-row class="mb-2">
      <v-btn class="mr-auto!" @click="addModalOpen = true">
        Create a room</v-btn
      >
      <Modal v-model="addModalOpen" max-width="600">
        <RoomForm @success="closeModal" />
      </Modal>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ItemsGrid :items="rooms">
          <template #item="{ itemData }">
            <RoomCard v-bind="itemData" />
          </template>
        </ItemsGrid>
      </v-col>
    </v-row>
  </v-container>
</template>
