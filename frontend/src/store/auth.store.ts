import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { IRegisterUser, IUser } from "@/types/user.types.js";

const AUTH_URL = "/api/auth";
const USER_STORAGE_KEY = "currentUser";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<Omit<IUser, "password"> | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>("");

  const isAuthenticated = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  function clearError() {
    error.value = null;
  }

  function saveUserToStorage(userData: Omit<IUser, "password">) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }
  function removeUserFromStorage() {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  function loadUserFromStorage() {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser) as Omit<IUser, "password">;
        console.log("User loaded from Local Storage.");
      } catch (e) {
        console.error("Failed to parse user from Local Storage:", e);
        removeUserFromStorage();
      }
    }
  }

  async function register(userData: IRegisterUser) {
    try {
      const res = await axios.post<{
        data: Omit<IUser, "password">;
        message: string;
      }>(`${AUTH_URL}/register`, userData);
      const registeredUser = res.data.data;
      user.value = registeredUser;
      saveUserToStorage(registeredUser);

      console.log("Registration successful!", res.data.message);

      return res.data;
    } catch (err) {
      const errorMessage = "Registration failed.";
      console.log(errorMessage);
      user.value = null;
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  }

  async function login(loginData: { email: string; password: string }) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post<{
        data: Omit<IUser, "password">;
        message: string;
      }>(`${AUTH_URL}/login`, loginData);

      const loggedInUser = response.data.data;
      user.value = loggedInUser;
      saveUserToStorage(loggedInUser);

      console.log("Login successful!", response.data.message);

      return response.data;
    } catch (err: any) {
      const errorMessage = "Login failed.";
      console.log(errorMessage);
      error.value = errorMessage;
      user.value = null;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    removeUserFromStorage();
    console.log("User logged out.");
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    loadUserFromStorage,
    clearError,
    register,
    login,
    logout,
  };
});
