<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { ILoginUser } from "@/types/user.types";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

// --- Login logic ---
const authStore = useAuthStore();
const emit = defineEmits(["success", "close"]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// --- Form States ---
const formData = reactive<ILoginUser>({
  email: "",
  password: "",
});
const form = ref<VForm | null>(null);
const visible = ref(false);

// --- Validation Rules ---
const requiredRule = (value: string) => !!value || "This field is required.";
const emailRule = (value: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || "Invalid email format.";
};

// --- Routing ----
const router = useRouter();

// --- Submission Handler ---
const handleLogin = async () => {
  // clear prev errors
  errorMessage.value = null;
  authStore.clearError();

  // Use the form ref to trigger validation
  const { valid } = await form.value!.validate();

  if (valid) {
    // Add actual login/API call logic here
    isLoading.value = true;
    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };
    console.log("payload  ", payload);

    try {
      const res = await authStore.login(payload);
      //#TODO: Add toastify
      console.log(res.message);
      router.push({ name: "Dashboard" });
      emit("success");
    } catch (error) {
      errorMessage.value =
        authStore.error || "An unknown error occurred during login.";
      //#TODO: Add toastify
      console.error("❌ Login failed:", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
    form.value?.reset();
  } else {
    //#TODO: Add toastify
    console.log("❌ Login validation failed. Please correct the errors.");
  }
};
</script>

<template>
  <div class="text-h6 text-center text-blue-darken-2 mb-4">Welcome Back!</div>

  <v-form ref="form" @submit.prevent="handleLogin">
    <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    <v-text-field
      v-model="formData.email"
      :rules="[requiredRule, emailRule]"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      type="email"
      class="mb-4"
    ></v-text-field>

    <div
      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
    >
      Password
    </div>
    <v-text-field
      v-model="formData.password"
      :rules="[requiredRule]"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
      class="mb-8"
    ></v-text-field>

    <v-btn
      type="submit"
      class="mb-4"
      color="blue"
      size="large"
      variant="tonal"
      block
    >
      Log In
    </v-btn>
  </v-form>

  <v-card-text class="text-center">
    <a
      class="text-blue text-decoration-none font-weight-bold text-sm!"
      href="#"
      rel="noopener noreferrer"
    >
      Create an Account <v-icon icon="mdi-chevron-right"></v-icon>
    </a>
  </v-card-text>
</template>
