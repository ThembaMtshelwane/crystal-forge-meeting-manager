<script setup lang="ts">
import { useRoomStore } from "@/store/room.store";
import { IRoomResponse } from "@/types/room.types";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import Modal from "../ui/Modal.vue";
import RoomView from "@/views/RoomView.vue";

const props = defineProps<IRoomResponse>();
const display = useDisplay();
const roomStore = useRoomStore();

const MAX_DESCRIPTION = computed(() => {
  if (display.mdAndUp.value) {
    return 110;
  } else if (display.smAndUp.value) {
    return 90;
  }
  return 120;
});

const detailsModalOpen = ref(false);

function handleRoomDeleted(id: string) {
  // Close the modal
  detailsModalOpen.value = false;

  // Refresh the rooms list
  roomStore.getRooms();
}

function handleRoomUpdated(id: string) {
  // Close the modal
  detailsModalOpen.value = false;

  // Refresh the rooms list to show updated data
  roomStore.getRooms();
}
</script>

<template>
  <v-card
    :title="props.name"
    elevation="3"
    class="d-flex flex-column h-[275px] pa-4"
  >
    <v-card-subtitle class="mb-2">
      <div class="d-flex align-center text-truncate">
        <v-icon start icon="mdi-map-marker" size="small"></v-icon>
        <span class="text-medium-emphasis capitalize">{{
          props.location
        }}</span>
      </div>
    </v-card-subtitle>

    <v-card-subtitle class="mb-2">
      <div class="d-flex align-center text-truncate">
        <v-icon start icon="mdi-account-group" size="small"></v-icon>
        <span class="text-medium-emphasis">
          Capacity: {{ props.capacity }}
        </span>
      </div>
    </v-card-subtitle>

    <v-divider class="mx-4"></v-divider>

    <v-card-text
      v-if="props.description"
      class="description-clamp overflow-hidden h-16"
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
    <RoomView
      :room="{
        id: props.id,
        name: props.name,
        description: props.description,
        location: props.location,
        capacity: props.capacity,
      }"
      @deleted="handleRoomDeleted"
      @updated="handleRoomUpdated"
    />
  </Modal>
</template>
