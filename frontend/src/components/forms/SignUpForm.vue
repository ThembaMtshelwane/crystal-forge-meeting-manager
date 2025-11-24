<script setup lang="ts">
import { reactive, ref } from "vue";
import type { VForm } from "vuetify/components";

// Use a reactive object to hold all form fields
const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  organizationId: "",
});

// Ref to access the Vuetify form component for validation
const form = ref<VForm | null>(null);

// State for password visibility toggling
const visible = ref(false);

// --- Validation Rules ---

// General required rule
const requiredRule = (value: string) => !!value || "This field is required.";

// Email validation rule
const emailRule = (value: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || "Invalid email format.";
};

// Password validation rule (e.g., min length 8)
const passwordRule = (value: string) =>
  value.length >= 8 || "Password must be at least 8 characters.";

// --- Submission Handler ---

const handleSignUp = async () => {
  // Use the form ref to trigger validation
  const { valid } = await form.value!.validate();

  if (valid) {
    // Validation succeeded, console the data
    console.log("✅ Form is valid. Attempting to sign up with data:");
    console.log({
      // Spread the reactive object to ensure a plain object is logged
      ...formData,
      // Optional: don't log the raw password in a real app, 
      // but for demonstration we show all validated data.
    });

    // Add actual sign-up/API call logic here
    
    // Example: Optional reset
    // form.value?.reset();
    
  } else {
    // Validation failed
    console.log("❌ Form validation failed. Please correct the errors.");
  }
};
</script>

<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="600" rounded="lg">
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
              :rules="[requiredRule]"
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
  </v-card>
</template>