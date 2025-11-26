import { defineStore } from "pinia";
import axios from "axios";
import type { IMeetingResponse } from "@/types/meeting.types.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useMeetingStore = defineStore("meetings", {
  state: () => ({
    meetings: [] as IMeetingResponse[],
    userMeetings: [] as IMeetingResponse[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch all meetings
    async getMeetings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/meetings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.meetings = response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to fetch meetings";
        console.error("Error fetching meetings:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch logged-in user's meetings
    async getLoggedInUserMeetings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/meetings/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.userMeetings = response.data.data;
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to fetch user meetings";
        console.error("Error fetching user meetings:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch meetings for a specific user (admin only)
    async getUserMeetings(userId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/meetings/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to fetch user meetings";
        console.error("Error fetching user meetings:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Create a new meeting
    async createMeeting(meetingData: Partial<IMeetingResponse>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/meetings`, meetingData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.meetings.push(response.data.data);
        return response.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to create meeting";
        console.error("Error creating meeting:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update a meeting
    async updateMeeting(id: string, updates: Partial<IMeetingResponse>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.patch(
          `${API_URL}/meetings/${id}`,
          updates,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const index = this.meetings.findIndex((m) => m.id === id);
        if (index !== -1) {
          this.meetings[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to update meeting";
        console.error("Error updating meeting:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a meeting
    async deleteMeeting(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_URL}/meetings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.meetings = this.meetings.filter((m) => m.id !== id);
        this.userMeetings = this.userMeetings.filter((m) => m.id !== id);
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Failed to delete meeting";
        console.error("Error deleting meeting:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
