<script setup lang="ts">
import { sidebarLinks } from "@/constants/sidebar.links";
import { useAuthStore } from "@/store/auth.store";
import { Role } from "@/types/user.types";
import { computed } from "vue";
import { useDisplay } from "vuetify";

const modelValue = defineModel<boolean>();
const display = useDisplay();

const isPermanent = computed(() => {
  return display.mdAndUp.value;
});

const authStore = useAuthStore();

const user = computed(() => authStore.currentUser);

const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : "Guest"
);

const availableLinks = sidebarLinks.filter((sl) =>
  sl.roles.includes(user.value?.role as Role | "member")
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
  >
    <v-list>
      <v-list-item
        class="capitalize!"
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="fullName"
        :subtitle="user?.username"
      >
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item
        v-for="link in availableLinks"
        :key="link.value"
        :prepend-icon="link.icon"
        :title="link.title"
        :value="link.value"
        :to="link.path"
        exact
        :active-class="link.path === '/' ? 'v-list-item--active' : undefined"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
