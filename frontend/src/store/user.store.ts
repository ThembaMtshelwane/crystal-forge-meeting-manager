import { IUser } from "@/types/user.types.js";
import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  const users = ref<IUser[] | []>([]);
  const user = ref<IUser | null>(null);
  const userProfile = ref<Omit<IUser, "password"> | null>(null);
  type UserUpdatePayload = Partial<Omit<IUser, "id">>;

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getUsers() {
    users.value = [];
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{ data: IUser[]; message: string }>(
        `api/users`
      );
      console.log("get all users res ", response.data.data);

      users.value = response.data.data;
    } catch (err: any) {
      error.value = "Failed to fetch user data.";
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function getSingleUser(id: string) {
    user.value = null;
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<{ data: IUser; message: string }>(
        `api/users/${id}`
      );
      user.value = response.data.data;
    } catch (err: any) {
      error.value = `Failed to fetch user with ID ${id}.`;
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserProfile() {
    userProfile.value = null;
    loading.value = true;
    error.value = null;

    try {
      // The API response for profile omits the password
      const response = await axios.get<{
        data: Omit<IUser, "password">;
        message: string;
      }>(`api/users/profile`);
      userProfile.value = response.data.data;
    } catch (err: any) {
      error.value = "Failed to fetch user profile.";
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(id: string, updates: UserUpdatePayload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.patch<{ data: IUser; message: string }>(
        `api/users/${id}`,
        updates
      );

      // Update the state if the updated user is currently loaded (single user or profile)
      if (user.value && user.value.id === id) {
        user.value = response.data.data;
      }
      if (userProfile.value && userProfile.value.id === id) {
        // Need to ensure password is omitted from the update in the profile state
        const { password, ...updatedProfile } = response.data.data;
        userProfile.value = updatedProfile;
      }
      // Note: If you have a large list of users, you might want to update it here too.

      return response.data.data; // Return the updated user object
    } catch (err: any) {
      error.value = `Failed to update user with ID ${id}.`;
      console.error("API Error:", err);
      throw err; // Propagate error for component-level handling
    } finally {
      loading.value = false;
    }
  }

  async function toggleUserStatus(id: string, newStatus: boolean) {
    loading.value = true;
    error.value = null;

    try {
  
      const response = await axios.patch<{ data: IUser; message: string }>(
        `api/users/deactivate`, 
        { id, status: newStatus }
      );

      if (user.value && user.value.id === id) {
        user.value.status = newStatus;
      }

      const userIndexInList = users.value.findIndex((u) => u.id === id);
      if (userIndexInList !== -1) {
        users.value[userIndexInList].status = newStatus;
      }

      return response.data.data;
    } catch (err: any) {
      error.value = `Failed to toggle status for user ID ${id}.`;
      console.error("API Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    user,
    userProfile,
    loading,
    error,

    getUsers,
    getSingleUser,
    fetchUserProfile,
    updateUser,
    toggleUserStatus,
  };
});
