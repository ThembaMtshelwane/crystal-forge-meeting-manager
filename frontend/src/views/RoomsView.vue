<script setup lang="ts">
import RoomCard from "@/components/cards/RoomCard.vue";
import ItemsGrid from "@/components/ui/ItemsGrid.vue";
import { useRoomStore } from "@/store/room.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);
onMounted(async () => {
  await roomStore.getRooms();
});
</script>

<template>
  <h1>Rooms Page</h1>
  <ItemsGrid :items="rooms">
    <template #item="{ itemData }">
      <RoomCard v-bind="itemData" />
    </template>
  </ItemsGrid>
</template>
