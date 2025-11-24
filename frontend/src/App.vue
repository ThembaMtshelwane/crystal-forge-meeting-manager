<template>
  <v-app>
    <v-app-bar app color="blue-grey-darken-4" dark class="shadow-lg">
      <v-toolbar-title class="font-bold"> Vue 3 + TS </v-toolbar-title>
      <v-spacer></v-spacer>

      <router-link to="/">
        <v-btn variant="text" class="text-white hover:bg-gray-700 mx-2">
          Home
        </v-btn>
      </router-link>
      <router-link to="/about">
        <v-btn variant="text" class="text-white hover:bg-gray-700 mx-2">
          About
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main class="bg-gray-100 min-h-screen">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Vue Router components are globally available after app.use(router)
</script>

<style scoped>
/* Optional: Simple fade transition for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure RouterLink doesn't override button styles */
a {
  text-decoration: none;
  color: inherit;
}
</style>
