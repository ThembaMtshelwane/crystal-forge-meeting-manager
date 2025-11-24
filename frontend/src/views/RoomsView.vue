<script setup lang="ts">
import { useRoomStore } from "@/store/room.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const roomStore = useRoomStore();
const { room, rooms } = storeToRefs(roomStore);

console.log("rooms  ", rooms.value);

onMounted(async () => {
  await roomStore.getRooms();
  await roomStore.getRoom("r2001");
});
</script>

<template>
  <ul>
    <li v-for="room in rooms">{{ room.name }}</li>
  </ul>

  <div>{{ room?.id }}</div>
  <h1>Rooms Page</h1>
</template>
