<script setup lang="ts">
import { useMeetingStore } from "@/store/meetings.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const meetingStore = useMeetingStore();
const { meetings, meeting } = storeToRefs(meetingStore);

console.log("meetings, ", meetings.value);

onMounted(async () => {
  await meetingStore.getMeetings();
  await meetingStore.getMeeting("m-6a0e2c1b-7f3d-4a92-8805-5c4b3a2d1e0f");
});
</script>

<template>
  <h1>Meetings - See Meetings based on the logged in user role</h1>
  <ul>
    <li v-for="meeting in meetings">{{ meeting.title }}</li>
    <div>{{ meeting?.id }}</div>
  </ul>
</template>
