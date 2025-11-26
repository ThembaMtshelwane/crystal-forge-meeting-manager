<script setup lang="ts">
import { sidebarLinks } from "@/constants/sidebar.links";
import { useAuthStore } from "@/store/auth.store";
import { Role } from "@/types/user.types";
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";

const modelValue = defineModel<boolean>();
const display = useDisplay();

const isPermanent = computed(() => {
  return display.mdAndUp.value;
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : "Guest"
);

const userRole = computed(() => {
  if (user.value?.role === "admin") return "Administrator";
  return "Member";
});

const availableLinks = computed(() =>
  sidebarLinks.filter((sl) =>
    sl.roles.includes(user.value?.role as Role | "member")
  )
);
</script>

<template>
  <v-navigation-drawer
    :model-value="isPermanent ? true : modelValue"
    @update:model-value="
      (val) => {
        if (!isPermanent) modelValue = val;
      }
    "
    :permanent="isPermanent"
    :temporary="!isPermanent"
    :rail="false"
    class="border-r border-blue-100"
  >
    <!-- User Profile Section -->
    <div class="pa-6 bg-gradient-to-br from-blue-600 to-blue-700">
      <div class="flex items-center gap-4">
        <v-avatar size="56" color="white" class="shadow-md">
          <v-icon icon="mdi-account-circle" size="56" color="primary"></v-icon>
        </v-avatar>

        <div class="flex-grow text-white">
          <p class="font-bold text-lg mb-0 capitalize">{{ fullName }}</p>
          <p class="text-sm text-blue-100 mb-0">@{{ user?.username }}</p>
          <v-chip
            size="x-small"
            variant="flat"
            :color="user?.role === 'admin' ? 'amber' : 'blue-lighten-3'"
            class="mt-1 font-semibold"
          >
            {{ userRole }}
          </v-chip>
        </div>
      </div>
    </div>

    <v-divider class="border-blue-100"></v-divider>

    <!-- Navigation Links -->
    <v-list nav class="py-4">
      <v-list-item
        v-for="link in availableLinks"
        :key="link.value"
        :prepend-icon="link.icon"
        :title="link.title"
        :value="link.value"
        :to="link.path"
        exact
        class="mx-3 mb-1 rounded-lg transition-all"
        :active-class="link.path === '/' ? 'v-list-item--active' : undefined"
        active-color="primary"
      >
        <template v-slot:prepend>
          <v-icon :icon="link.icon" class="mr-3"></v-icon>
        </template>
      </v-list-item>
    </v-list>

    <!-- Footer -->
    <template v-slot:append>
      <div class="pa-4 border-t border-blue-100">
        <div class="text-center text-xs text-gray-600">
          <p class="mb-1 font-semibold text-blue-900">Crystal Forge Meets</p>
          <p class="text-gray-500">v1.0.0</p>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.v-list-item--active {
  background: rgba(25, 118, 210, 0.08);
  border-left: 4px solid rgb(25, 118, 210);
}

.v-list-item:hover:not(.v-list-item--active) {
  background: rgba(25, 118, 210, 0.04);
}
</style>
