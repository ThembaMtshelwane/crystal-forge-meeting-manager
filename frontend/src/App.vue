<template>
  <v-app>
    <v-main class="bg-blue-50">
      <div class="p-8 flex flex-col items-center justify-center min-h-screen">
        <v-card
          class="mx-auto rounded-xl shadow-2xl p-6!"
          max-width="600"
          elevation="10"
        >
          <h1 class="text-4xl font-extrabold text-blue-700 mb-4">
            Hello World!
          </h1>

          <v-btn
            color="primary"
            variant="flat"
            size="large"
            @click="message = 'Setup is working! 🥳'"
            class="mt-4"
          >
            Click Me to Test State
          </v-btn>

          <div
            class="mt-6 p-4 border-l-4 border-green-500 bg-green-100 text-green-800 text-xl font-medium"
          >
            {{ message }}
          </div>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
const message = ref("If you see this, Vue is running.");
</script>
