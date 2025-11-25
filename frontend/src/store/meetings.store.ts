import { IMeetingResponse } from "@/types/meeting.types.js";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMeetingStore = defineStore("meeting", () => {
  const meetings = ref<IMeetingResponse[] | []>([]);
  const meeting = ref<IMeetingResponse | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const MEETING_URL = "api/meetings";

  async function getMeetings() {
    meetings.value = [];
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{
        data: IMeetingResponse[];
        message: string;
      }>(`${MEETING_URL}/`);

      meetings.value = response.data.data;
    } catch (err: any) {
      error.value = "Failed to fetch user data.";
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function getMeeting(id: string) {
    meeting.value = null;
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{
        data: IMeetingResponse;
        message: string;
      }>(`${MEETING_URL}/${id}`);
      meeting.value = response.data.data;
    } catch (err: any) {
      error.value = `Failed to fetch user with ID ${id}.`;
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    meeting,
    meetings,
    loading,
    error,

    getMeetings,
    getMeeting,
  };
});
