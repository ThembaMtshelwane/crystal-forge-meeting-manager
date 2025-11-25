import { IRoomResponse } from "@/types/room.types.js";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoomStore = defineStore("room", () => {
  const rooms = ref<IRoomResponse[] | []>([]);
  const room = ref<IRoomResponse | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getRooms() {
    rooms.value = [];
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{
        data: IRoomResponse[];
        message: string;
      }>(`api/rooms`);

      rooms.value = response.data.data;
    } catch (err: any) {
      error.value = "Failed to fetch user data.";
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function getRoom(id: string) {
    room.value = null;
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{
        data: IRoomResponse;
        message: string;
      }>(`api/rooms/${id}`);
      room.value = response.data.data;
    } catch (err: any) {
      error.value = `Failed to fetch user with ID ${id}.`;
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    rooms,
    room,

    getRooms,
    getRoom,
  };
});
