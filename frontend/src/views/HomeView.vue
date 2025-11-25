<script setup lang="ts">
import { useDisplay } from "vuetify";
import LoginForm from "@/components/forms/LoginForm.vue";
import SignUpForm from "@/components/forms/SignUpForm.vue";
import { ref } from "vue";
import Modal from "@/components/ui/Modal.vue";

const display = useDisplay();
const loginModalOpen = ref(false);
const signupModalOpen = ref(false);

const handleSuccessfulRegistration = () => {
  signupModalOpen.value = false;
  console.log("Registration complete! Modal closed.");
};
const handleSuccessfulLogin = () => {
  signupModalOpen.value = false;
  console.log("Login complete! Modal closed.");
};
</script>

<template>
  <v-app>
    <v-app-bar class="px-4">
      <div class="w-full md:w-[1050px] mx-auto flex items-center">
        <v-toolbar-title class="font-bold!">
          {{ display.smAndUp.value ? " Crystal Forge Meets" : "CTM" }}
        </v-toolbar-title>
        <v-btn @click="loginModalOpen = true"> Login </v-btn>
        <v-btn @click="signupModalOpen = true"> SignUp </v-btn>
      </div>
    </v-app-bar>

    <Modal v-model="loginModalOpen" max-width="448">
      <LoginForm @success="handleSuccessfulLogin" />
    </Modal>

    <Modal v-model="signupModalOpen" max-width="600">
      <SignUpForm @success="handleSuccessfulRegistration" />
    </Modal>
  </v-app>
</template>
