<script setup lang="ts">
import { useMeetingStore } from "@/store/meetings.store";
import { useRoomStore } from "@/store/room.store";
import { useUserStore } from "@/store/user.store";
import { useAuthStore } from "@/store/auth.store";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const meetingStore = useMeetingStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const { meetings } = storeToRefs(meetingStore);
const { rooms } = storeToRefs(roomStore);
const { users } = storeToRefs(userStore);
const { user } = storeToRefs(authStore);

const isLoading = ref(true);

// Computed KPIs
const totalMeetings = computed(() => meetings.value.length);
const activeMeetings = computed(
  () => meetings.value.filter((m) => m.status === true).length
);
const totalRooms = computed(() => rooms.value.length);
const totalUsers = computed(() => users.value.length);

const isAdmin = computed(() => user.value?.role === "admin");

// KPI cards configuration
const memberKPIs = computed(() => [
  {
    title: "Total Meetings",
    value: totalMeetings.value,
    icon: "mdi-calendar-multiple",
    description: "All scheduled meetings",
  },
  {
    title: "Active Meetings",
    value: activeMeetings.value,
    icon: "mdi-calendar-check",
    description: "Currently active",
  },
  {
    title: "Available Rooms",
    value: totalRooms.value,
    icon: "mdi-office-building",
    description: "Meeting rooms",
  },
]);

const adminKPIs = computed(() => [
  ...memberKPIs.value,
  {
    title: "Total Users",
    value: totalUsers.value,
    icon: "mdi-account-group",
    description: "Registered users",
  },
]);

const displayKPIs = computed(() =>
  isAdmin.value ? adminKPIs.value : memberKPIs.value
);

const recentMeetings = computed(() =>
  [...meetings.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
);

// Stats overview
const meetingStats = computed(() => ({
  upcomingCount: meetings.value.filter(
    (m) => new Date(m.date) > new Date() && m.status
  ).length,
  completedCount: meetings.value.filter((m) => new Date(m.date) < new Date())
    .length,
  cancelledCount: meetings.value.filter((m) => !m.status).length,
}));

onMounted(async () => {
  try {
    await Promise.all([
      meetingStore.getMeetings(),
      roomStore.getRooms(),
      isAdmin.value ? userStore.getUsers() : Promise.resolve(),
    ]);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <!-- Header -->
  <v-row>
    <v-col cols="12">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary">
          Welcome back, {{ user?.username || "User" }}
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Here's an overview of your meetings
        </p>
      </div>

      <v-divider class="mt-4"></v-divider>
    </v-col>
  </v-row>

  <!-- Loading State -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </div>

  <!-- Dashboard Content -->
  <div v-else>
    <!-- KPI Cards Grid -->
    <v-row class="mb-6">
      <v-col
        v-for="(kpi, index) in displayKPIs"
        :key="index"
        cols="12"
        sm="6"
        md="6"
        :lg="isAdmin ? '3' : '4'"
      >
        <v-card
          class="rounded-xl border-l-4 border-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          elevation="2"
        >
          <v-card-text class="p-6">
            <div class="flex items-center mb-4">
              <div
                class="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mr-4"
              >
                <v-icon :icon="kpi.icon" size="32" color="primary"></v-icon>
              </div>
              <div class="flex-grow">
                <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  {{ kpi.title }}
                </p>
                <h2 class="text-4xl font-bold text-blue-900">
                  {{ kpi.value }}
                </h2>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-0">
              {{ kpi.description }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Secondary Stats & Recent Activity -->
    <v-row>
      <!-- Meeting Statistics -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-full rounded-xl">
          <v-card-title class="px-6 pt-6 pb-4">
            <div class="flex items-center">
              <v-icon
                icon="mdi-chart-bar"
                size="24"
                color="primary"
                class="mr-3"
              ></v-icon>
              <span class="text-xl font-bold">Meeting Statistics</span>
            </div>
          </v-card-title>

          <v-card-text class="px-6 pb-6 pt-0">
            <div class="pb-2 mb-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-base font-medium text-gray-700"
                  >Upcoming</span
                >
                <span class="text-2xl font-bold text-blue-600">
                  {{ meetingStats.upcomingCount }}
                </span>
              </div>
              <v-progress-linear
                :model-value="
                  totalMeetings > 0
                    ? (meetingStats.upcomingCount / totalMeetings) * 100
                    : 0
                "
                color="primary"
                height="6"
                rounded
                class="rounded-full"
              ></v-progress-linear>
            </div>

            <div class="pb-2 mb-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-base font-medium text-gray-700"
                  >Completed</span
                >
                <span class="text-2xl font-bold text-blue-400">
                  {{ meetingStats.completedCount }}
                </span>
              </div>
              <v-progress-linear
                :model-value="
                  totalMeetings > 0
                    ? (meetingStats.completedCount / totalMeetings) * 100
                    : 0
                "
                color="blue-lighten-1"
                height="6"
                rounded
                class="rounded-full"
              ></v-progress-linear>
            </div>

            <div class="pb-2">
              <div class="flex items-center justify-between mb-2">
                <span class="text-base font-medium text-gray-700"
                  >Cancelled</span
                >
                <span class="text-2xl font-bold text-gray-500">
                  {{ meetingStats.cancelledCount }}
                </span>
              </div>
              <v-progress-linear
                :model-value="
                  totalMeetings > 0
                    ? (meetingStats.cancelledCount / totalMeetings) * 100
                    : 0
                "
                color="blue-grey"
                height="6"
                rounded
                class="rounded-full"
              ></v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent Meetings -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-full rounded-xl">
          <v-card-title class="px-6 pt-6 pb-4">
            <div class="flex items-center">
              <v-icon
                icon="mdi-clock-outline"
                size="24"
                color="primary"
                class="mr-3"
              ></v-icon>
              <span class="text-xl font-bold">Recent Meetings</span>
            </div>
          </v-card-title>

          <v-card-text class="px-6 pb-6 pt-0">
            <v-list
              v-if="recentMeetings.length > 0"
              class="bg-transparent pa-0"
            >
              <v-list-item
                v-for="(meeting, index) in recentMeetings"
                :key="meeting.id"
                class="px-4 py-3 mb-2 rounded-lg bg-blue-50 transition-all duration-200 hover:bg-blue-100 border-l-3 border-transparent hover:border-blue-600"
              >
                <template v-slot:prepend>
                  <v-icon
                    :icon="
                      meeting.status
                        ? 'mdi-calendar-check'
                        : 'mdi-calendar-remove'
                    "
                    :color="meeting.status ? 'primary' : 'blue-grey'"
                    size="28"
                  ></v-icon>
                </template>

                <v-list-item-title class="font-bold mb-1">
                  {{ meeting.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-xs text-gray-600">
                  {{ meeting.date }} · {{ meeting.startTime }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-chip
                    :color="meeting.status ? 'primary' : 'blue-grey'"
                    size="small"
                    variant="flat"
                    class="font-semibold"
                  >
                    {{ meeting.status ? "Active" : "Cancelled" }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>

            <div v-else class="text-center py-8">
              <v-icon
                icon="mdi-calendar-blank"
                size="48"
                color="blue-grey-lighten-2"
                class="mb-3"
              ></v-icon>
              <p class="text-sm text-gray-600">No meetings scheduled yet</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
