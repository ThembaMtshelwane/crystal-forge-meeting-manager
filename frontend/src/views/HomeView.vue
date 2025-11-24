<script setup lang="ts">
import { useDisplay } from "vuetify";
import LoginForm from "@/components/forms/LoginForm.vue"

const display = useDisplay();
</script>

<template>
  <v-app>
    <v-app-bar class="px-4">
      <div class="w-full md:w-[1050px] mx-auto flex items-center">
        <v-toolbar-title class="font-bold!">
          {{ display.smAndUp.value ? " Crystal Forge Meets" : "CTM" }}
        </v-toolbar-title>
        <v-btn> Login </v-btn>
        <v-btn> SignUp </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <LoginForm/>
    </v-main>
  </v-app>
</template>
