<script setup lang="ts">
import { reactive, ref } from "vue";
import type { VForm } from "vuetify/components";


const formData = reactive({
  email: "",
  password: "",
});


const form = ref<VForm | null>(null);


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

// --- Submission Handler ---
const handleLogin = async () => {
  // Use the form ref to trigger validation
  const { valid } = await form.value!.validate();

  if (valid) {
    // Validation succeeded, console the data
    console.log("✅ Login form is valid. Attempting to log in with data:");
    console.log({
      // Spread the reactive object to ensure a plain object is logged
      ...formData,
    });

    // Add actual login/API call logic here
  } else {
    // Validation failed
    console.log("❌ Login validation failed. Please correct the errors.");
  }
};
</script>

<template>
  <div>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-h6 text-center text-blue-darken-2 mb-4">
        Welcome Back!
      </div>

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
          class="text-blue text-decoration-none font-weight-bold"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Create an Account <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </div>
</template>
