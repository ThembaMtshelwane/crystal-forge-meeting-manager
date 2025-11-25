import { IMeeting } from "@/types/meeting.types.js";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMeetingStore = defineStore("meeting", () => {
  const meetings = ref<IMeeting[] | []>([]);
  const meeting = ref<IMeeting | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const MEETING_URL = "api/meetings";

  async function getMeetings() {
    meetings.value = [];
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{
        data: IMeeting[];
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

  return {
    meeting,
    meetings,
    loading,
    error,

    getMeetings,
  };
});
