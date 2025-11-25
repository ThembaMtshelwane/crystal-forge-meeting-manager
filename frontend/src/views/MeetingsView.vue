<script setup lang="ts">
import MeetingCard from "@/components/cards/MeetingCard.vue";
import ItemsGrid from "@/components/ui/ItemsGrid.vue";
import { useMeetingStore } from "@/store/meetings.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const meetingStore = useMeetingStore();
const { meetings } = storeToRefs(meetingStore);
onMounted(async () => {
  await meetingStore.getMeetings();
});
</script>

<template>
  <h1>Meetings - See Meetings based on the logged in user role</h1>
  <ItemsGrid :items="meetings">
    <template #item="{ itemData }">
      <MeetingCard v-bind="itemData" />
    </template>
  </ItemsGrid>
</template>
