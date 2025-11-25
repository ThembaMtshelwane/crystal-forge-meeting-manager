<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { IRegisterUser } from "@/types/user.types";
import { reactive, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

// --- Sign up logic ---
const authStore = useAuthStore();
const emit = defineEmits(["success", "close"]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// --- Form States ---
const formData = reactive<IRegisterUser>({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  organizationId: "cfm-1",
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
const passwordRule = (value: string) =>
  value.length >= 8 || "Password must be at least 8 characters.";

// --- Routing ----
const router = useRouter();

// --- Submission Handler ---
const handleSignUp = async () => {
  // clear prev errors
  errorMessage.value = null;
  authStore.clearError();

  // Use the form ref to trigger validation
  const { valid } = await form.value!.validate();

  if (valid) {
    // Add actual sign-up/API call logic here
    isLoading.value = true;
    const payload = {
      firstName: formData.firstName.trim().toLowerCase(),
      lastName: formData.lastName.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      username: formData.username.trim().toLowerCase(),
      organizationId: formData.organizationId.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      const res = await authStore.register(payload);
      //#TODO: Add toastify
      console.log(res.message);
      router.push({ name: "Dashboard" });
      emit("success");
    } catch (error) {
      errorMessage.value =
        authStore.error || "An unknown error occurred during registration.";
      //#TODO: Add toastify
      console.error("❌ Registration failed:", errorMessage.value);
    } finally {
      isLoading.value = false;
    }

    form.value?.reset();
  } else {
    //#TODO: Add toastify
    console.log("❌ Form validation failed. Please correct the errors.");
  }
};
</script>

<template>
  <div class="text-h6 text-center text-blue-darken-2 mb-4">
    Create Your Account
  </div>

  <v-form ref="form" @submit.prevent="handleSignUp">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <div class="text-subtitle-1 text-medium-emphasis">First Name</div>
          <v-text-field
            v-model="formData.firstName"
            :rules="[requiredRule]"
            density="compact"
            placeholder="Jane"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="py-0">
          <div class="text-subtitle-1 text-medium-emphasis">Last Name</div>
          <v-text-field
            v-model="formData.lastName"
            :rules="[requiredRule]"
            density="compact"
            placeholder="Doe"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="py-0">
          <div class="text-subtitle-1 text-medium-emphasis">Email</div>
          <v-text-field
            v-model="formData.email"
            :rules="[requiredRule, emailRule]"
            density="compact"
            placeholder="email@example.com"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            type="email"
            class="mb-4"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="py-0">
          <div
            class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
          >
            Password
          </div>
          <v-text-field
            v-model="formData.password"
            :rules="[requiredRule, passwordRule]"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Create a strong password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            class="mb-6"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <div class="text-subtitle-1 text-medium-emphasis">Username</div>
          <v-text-field
            v-model="formData.username"
            :rules="[requiredRule]"
            density="compact"
            placeholder="Choose a username"
            prepend-inner-icon="mdi-account-circle-outline"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="py-0">
          <div class="text-subtitle-1 text-medium-emphasis">
            Organization Code
          </div>
          <v-text-field
            v-model="formData.organizationId"
            disabled
            density="compact"
            placeholder="Enter your organization ID"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <v-btn
      type="submit"
      class="mb-4 mt-2"
      color="blue"
      size="large"
      variant="tonal"
      block
    >
      Create Account
    </v-btn>
  </v-form>

  <v-card-text class="text-center">
    <div class="text-medium-emphasis mb-2">Already have an account?</div>
    <a
      class="text-blue text-decoration-none font-weight-bold"
      href="#"
      rel="noopener noreferrer"
    >
      Go to Log In <v-icon icon="mdi-chevron-right"></v-icon>
    </a>
  </v-card-text>
</template>
