<script setup lang="ts">
import { IRoomResponse } from "@/types/room.types";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const props = defineProps<IRoomResponse>();
const display = useDisplay();
const router = useRouter();
const MAX_DESCRIPTION = computed(() => {
  if (display.mdAndUp.value) {
    return 110;
  } else if (display.smAndUp.value) {
    return 90;
  }
  return 120;
});

const goToDetails = () => {
  // Navigate using the route name and passing the meeting ID as a parameter
  router.push({
    name: "Room",
    params: { id: props.id },
  });
};
</script>

<template>
  <v-card :title="props.name" elevation="3" class="d-flex flex-column">
    <v-card-subtitle class="mb-2"
      >Dashboard Meetings Rooms Crystal Forge Meets Rooms Page Boardroom Alpha
      Main Office - 4th Floor, West Wing Capacity: 4 Main presentation room with
      video conferencing equipment and large monitor. Focus Pod 3 Main Office -
      4th Floor, Quiet Zone Capacity: 8 Small, soundproof booth designed for
      single-person focused work or video calls. The Commons Main Office -
      Ground Floor Capacity: 12

      <div class="d-flex align-center text-truncate">
        <v-icon start icon="mdi-map-marker" size="small"></v-icon>
        <span class="text-medium-emphasis">{{ props.location }}</span>
      </div>
    </v-card-subtitle>
    <v-card-subtitle class="mb-2">
      <div class="d-flex align-center text-truncate">
        <v-icon start icon="mdi-account-group" size="small"></v-icon>
        <span class="text-medium-emphasis">
          Capacity: {{ props.capacity }}</span
        >
      </div>
    </v-card-subtitle>

    <v-divider class="mx-4"></v-divider>

    <v-card-text
      v-if="props.description"
      class="description-clamp overflow-hidden border h-16"
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
      <v-btn color="blue" variant="flat" @click="goToDetails">
        <v-icon start icon="mdi-eye-arrow-right"></v-icon>
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
