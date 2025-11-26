<script setup lang="ts">
import { useUserStore } from "@/store/user.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const userStore = useUserStore();
const { users, loading, error } = storeToRefs(userStore);

console.log("users ", users.value);

onMounted(async () => {
  await userStore.getUsers();
});
</script>

<template>
  <h1 class="text-h4 font-weight-bold text-blue-darken-2">Current Users</h1>

  <ul>
    <li class="capitalize" v-for="user in users">
      {{ user.firstName }} {{ user.lastName }} - {{ user.role }}
    </li>
  </ul>
  <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
  <div class="flex w-full absolute">
    <p class="text-3xl sm:text-7xl text-primary font-extrabold">Work in Progress!</p>
  </div>
</template>
