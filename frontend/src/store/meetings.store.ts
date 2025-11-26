import { defineStore } from "pinia";
import type { IMeetingResponse } from "@/types/meeting.types.js";
import axios from "axios";

const MMETINGS_URL = "/api/meetings";
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
        const response = await axios.get(`${MMETINGS_URL}/`);
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
        const response = await axios.get(`${MMETINGS_URL}/profile`);
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
        const response = await axios.get(`${MMETINGS_URL}/user/${userId}`);
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
        const response = await axios.post(`${MMETINGS_URL}/`, meetingData);
        const newMeeting = response.data.data;

        // Add to meetings array
        this.meetings.push(newMeeting);

        // Add to userMeetings array (since the current user is creating it)
        this.userMeetings.push(newMeeting);

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
        const response = await axios.patch(`${MMETINGS_URL}/${id}`, updates);

        // Update in the meetings array
        const meetingsIndex = this.meetings.findIndex((m) => m.id === id);
        if (meetingsIndex !== -1) {
          this.meetings[meetingsIndex] = response.data;
        }

        // Update in the userMeetings array
        const userMeetingsIndex = this.userMeetings.findIndex(
          (m) => m.id === id
        );
        if (userMeetingsIndex !== -1) {
          this.userMeetings[userMeetingsIndex] = response.data;
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
        await axios.delete(`${MMETINGS_URL}/${id}`);
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
