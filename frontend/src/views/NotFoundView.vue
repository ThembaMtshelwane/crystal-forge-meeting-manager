<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <!-- 404 Number -->
        <div class="mb-4">
          <h1 class="text-h1 font-weight-bold text-grey-darken-1">404</h1>
        </div>

        <!-- Icon -->
        <div class="mb-4">
          <v-icon size="60" color="grey-darken-1">mdi-file-question-outline</v-icon>
        </div>

        <!-- Title -->
        <h2 class="text-h4 mb-3">Page Not Found</h2>

        <!-- Message -->
        <p class="text-body-1 text-medium-emphasis mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Action Buttons -->
        <div class="d-flex justify-center gap-2">
          <v-btn color="primary" @click="goHome" class="mr-2">
            Go Home
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="goBack">
            Go Back
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>