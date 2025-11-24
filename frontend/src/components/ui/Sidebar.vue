src/components/ui/Sidebar.vue
<script setup lang="ts">
import { stringify } from "querystring";
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
}
const sidebarLinks: ILinks[] = [
  {
    icon: "mdi-view-dashboard",
    title: "Dashboard",
    value: "dashboard",
    roles: ["admin", "member"],
  },
  {
    icon: "mdi-calendar",
    title: "Meetings",
    value: "meetings",
    roles: ["admin", "member"],
  },
  {
    icon: "mdi-domain",
    title: "Rooms",
    value: "rooms",
    roles: ["admin", "member"],
  },
  {
    icon: "mdi-account-group",
    title: "Users",
    value: "users",
    roles: ["admin"],
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
        :prepend-icon="link.icon"
        :title="link.title"
        :value="link.value"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
