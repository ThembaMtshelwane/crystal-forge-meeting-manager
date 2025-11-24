import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: {
      title: "Home Page",
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "/meetings",
    name: "Meetings",
    component: () => import("@/views/MeetingsView.vue"),
    meta: {
      title: "Meetings View",
    },
  },
  {
    path: "/meetings/:id",
    name: "Meeting",
    component: () => import("@/views/MeetingView.vue"),
    meta: {
      title: "Meeting Details",
    },
  },
  {
    path: "/rooms",
    name: "Rooms",
    component: () => import("@/views/RoomsView.vue"),
    meta: {
      title: "Rooms View",
    },
  },
  {
    path: "/rooms/:id",
    name: "Room",
    component: () => import("@/views/RoomView.vue"),
    meta: {
      title: "Room Details",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
    meta: {
      title: "Page Not Found!",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Optional: Global Navigation Guard (Example for setting the page title)
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || "My Vue App";
  next();
});

export default router;
