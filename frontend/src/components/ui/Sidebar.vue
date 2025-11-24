<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

const modelValue = defineModel<boolean>();
const display = useDisplay();

const isPermanent = computed(() => {
  return display.mdAndUp.value;
});

type Role = "admin" | "member";
interface ILinks {
  icon: string;
  title: string;
  value: string;
  roles: Role[];
  path: string;
}
const sidebarLinks: ILinks[] = [
  {
    icon: "mdi-view-dashboard",
    title: "Dashboard",
    value: "dashboard",
    roles: ["admin", "member"],
    path: "/dashboard",
  },
  {
    icon: "mdi-calendar",
    title: "Meetings",
    value: "meetings",
    roles: ["admin", "member"],
    path: "/meetings",
  },
  {
    icon: "mdi-domain",
    title: "Rooms",
    value: "rooms",
    roles: ["admin", "member"],
    path: "/rooms",
  },
  {
    icon: "mdi-account-group",
    title: "Users",
    value: "users",
    roles: ["admin"],
    path: "/users",
  },
];
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
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="Themba Mtshelwane"
        subtitle="thembamm3"
      >
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item
        v-for="link in sidebarLinks"
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
