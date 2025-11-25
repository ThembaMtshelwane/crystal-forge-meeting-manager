<script setup lang="ts">
import { useMeetingStore } from "@/store/meetings.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const meetingStore = useMeetingStore();
const { meetings, meeting } = storeToRefs(meetingStore);

console.log("meetings, ", meetings.value);

onMounted(async () => {
  await meetingStore.getMeetings();
});
</script>

<template>
  <h1>Meetings - See Meetings based on the logged in user role</h1>
  <ul>
    <li v-for="meeting in meetings">{{ meeting.title }}</li>
  </ul>

  <div>{{ meeting?.id }}</div>
</template>
