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
  <ul>
    <li v-for="user in users">{{ user.firstName }}</li>
  </ul>
  <h1>Dash Page</h1>
</template>
