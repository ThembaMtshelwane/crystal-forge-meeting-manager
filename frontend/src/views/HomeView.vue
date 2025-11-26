<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import LoginForm from "@/components/forms/LoginForm.vue";
import SignUpForm from "@/components/forms/SignUpForm.vue";
import { ref } from "vue";
import Modal from "@/components/ui/Modal.vue";

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const router = useRouter();
const display = useDisplay();

const loginModalOpen = ref(false);
const signupModalOpen = ref(false);

const goToDashboard = () => {
  router.push("/dashboard");
};

const features = [
  {
    icon: "mdi-calendar-check",
    title: "Meeting Management",
    description: "Schedule, organize, and manage meetings efficiently",
  },
  {
    icon: "mdi-office-building",
    title: "Room Booking",
    description: "Book and manage meeting rooms with ease",
  },
  {
    icon: "mdi-account-group",
    title: "Team Collaboration",
    description: "Collaborate with team members seamlessly",
  },
  {
    icon: "mdi-chart-line",
    title: "Analytics Dashboard",
    description: "Track meeting statistics and insights",
  },
];

const handleSuccessfulRegistration = () => {
  signupModalOpen.value = false;
  console.log("Registration complete! Modal closed.");
};

const handleSuccessfulLogin = () => {
  loginModalOpen.value = false;
  console.log("Login complete! Modal closed.");
};
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar class="px-4" elevation="2">
      <div class="w-full md:w-[1050px] mx-auto flex items-center">
        <v-toolbar-title class="font-bold text-blue-900">
          {{ display.smAndUp.value ? "Crystal Forge Meets" : "CFM" }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-if="isAuthenticated" class="flex items-center gap-2">
          <v-btn
            @click="goToDashboard"
            color="primary"
            variant="flat"
            prepend-icon="mdi-view-dashboard"
          >
            Dashboard
          </v-btn>
        </div>

        <div v-else class="flex items-center gap-2">
          <v-btn @click="loginModalOpen = true" color="primary" variant="text">
            Login
          </v-btn>
          <v-btn @click="signupModalOpen = true" color="primary" variant="flat">
            Sign Up
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Modals -->
    <Modal v-model="loginModalOpen" max-width="448">
      <LoginForm @success="handleSuccessfulLogin" />
    </Modal>

    <Modal v-model="signupModalOpen" max-width="600">
      <SignUpForm @success="handleSuccessfulRegistration" />
    </Modal>

    <!-- Main Content -->
    <v-main>
      <div class="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
        <!-- Hero Section -->
        <div class="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-6">
          <div class="text-center mb-16">
            <div class="flex justify-center mb-6">
              <div
                class="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg"
              >
                <v-icon
                  icon="mdi-calendar-account"
                  size="48"
                  color="white"
                ></v-icon>
              </div>
            </div>

            <h1 class="text-5xl font-bold text-blue-900 mb-4">
              Crystal Forge Meets
            </h1>

            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your meeting scheduling and room booking process. A
              comprehensive solution for organizing team meetings and managing
              resources efficiently.
            </p>

            <div class="flex justify-center gap-4 flex-wrap">
              <v-btn
                v-if="isAuthenticated"
                @click="goToDashboard"
                color="primary"
                variant="flat"
                size="x-large"
                prepend-icon="mdi-view-dashboard"
                class="text-lg px-8"
              >
                Go to Dashboard
              </v-btn>

              <template v-else>
                <v-btn
                  @click="signupModalOpen = true"
                  color="primary"
                  variant="flat"
                  size="x-large"
                  prepend-icon="mdi-account-plus"
                  class="text-lg px-8"
                >
                  Get Started
                </v-btn>

                <v-btn
                  @click="loginModalOpen = true"
                  variant="outlined"
                  size="x-large"
                  color="blue-darken-2"
                  prepend-icon="mdi-login"
                  class="text-lg px-8"
                >
                  Login
                </v-btn>
              </template>
            </div>
          </div>

          <!-- Features Grid -->
          <div class="mt-20">
            <h2 class="text-3xl font-bold text-center text-blue-900 mb-12">
              Key Features
            </h2>

            <v-row>
              <v-col
                v-for="(feature, index) in features"
                :key="index"
                cols="12"
                sm="6"
                md="3"
              >
                <v-card class="h-full text-center card-accent">
                  <v-card-text class="py-8">
                    <div class="flex justify-center mb-4">
                      <div
                        class="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center"
                      >
                        <v-icon
                          :icon="feature.icon"
                          size="36"
                          color="primary"
                        ></v-icon>
                      </div>
                    </div>

                    <h3 class="text-lg font-bold text-blue-900 mb-2">
                      {{ feature.title }}
                    </h3>

                    <p class="text-gray-600">
                      {{ feature.description }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- About Section -->
          <div class="mt-20">
            <v-card class="max-w-4xl mx-auto">
              <v-card-text class="py-12 px-8">
                <div class="flex items-start gap-6 flex-col md:flex-row">
                  <div class="flex-shrink-0">
                    <div
                      class="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center"
                    >
                      <v-icon
                        icon="mdi-information"
                        size="36"
                        color="primary"
                      ></v-icon>
                    </div>
                  </div>

                  <div class="flex-grow">
                    <h2 class="text-2xl font-bold text-blue-900 mb-4">
                      About Crystal Forge Meets
                    </h2>

                    <p class="text-gray-700 leading-relaxed mb-4">
                      Crystal Forge Meets is designed to simplify the process of
                      scheduling meetings and booking conference rooms. Whether
                      you're coordinating team meetings or managing
                      organizational resources, our platform provides the tools
                      you need.
                    </p>

                    <p class="text-gray-700 leading-relaxed mb-4">
                      With an intuitive interface and powerful features, you can
                      create meetings, assign rooms, track attendance, and
                      monitor room availability all in one place. Perfect for
                      teams of any size.
                    </p>

                    <div class="flex gap-4 mt-6 flex-wrap">
                      <v-chip color="primary" variant="flat">
                        <v-icon start icon="mdi-check-circle"></v-icon>
                        Easy Scheduling
                      </v-chip>
                      <v-chip color="blue-lighten-1" variant="flat">
                        <v-icon start icon="mdi-check-circle"></v-icon>
                        Room Management
                      </v-chip>
                      <v-chip color="blue-darken-1" variant="flat">
                        <v-icon start icon="mdi-check-circle"></v-icon>
                        Real-time Updates
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Footer -->
          <div class="mt-20 text-center text-gray-600">
            <p class="mb-2">© 2024 Crystal Forge Meets. All rights reserved.</p>
            <p class="text-sm">Built with Vue.js, Vuetify, and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
