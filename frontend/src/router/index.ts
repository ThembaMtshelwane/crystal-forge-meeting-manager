import { useAuthStore } from "@/store/auth.store.js";
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
      requiresGuest: true,
    },
  },
  {
    path: "/dashboard",
    component: () => import("@/layout/DashboardLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: {
          title: "Dashboard",
          roles: ["admin", "member"],
        },
      },
      {
        path: "/meetings",
        name: "Meetings",
        component: () => import("@/views/MeetingsView.vue"),
        meta: {
          title: "Meetings View",
          roles: ["admin", "member"],
        },
      },
      // {
      //   path: "/meetings/:id",
      //   name: "Meeting",
      //   component: () => import("@/views/MeetingDetailsView.vue"),
      //   meta: {
      //     title: "Meeting Details",
      //     roles: ["admin", "member"],
      //   },
      // },
      {
        path: "/rooms",
        name: "Rooms",
        component: () => import("@/views/RoomsView.vue"),
        meta: {
          title: "Rooms View",
          roles: ["admin", "member"],
        },
      },
      // {
      //   path: "/rooms/:id",
      //   name: "Room",
      //   component: () => import("@/views/RoomView.vue"),
      //   meta: {
      //     title: "Room Details",
      //     roles: ["admin", "member"],
      //   },
      // },
      {
        path: "/users",
        name: "users",
        component: () => import("@/views/UsersView.vue"),
        meta: {
          title: "Users",
          roles: ["admin"],
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || "My Vue App";

  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.currentUser?.role;

  // 1. Authentication Check (Protect Dashboard routes)

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect unauthorized users to the Home page for login
    return next({ name: "Home" });
  }

  // 2. Guest Check (Protect Home page from logged-in users)
  if (to.meta.requiresGuest && isAuthenticated) {
    // ✅ FIX: Use the explicit path '/dashboard' instead of the name.
    // This ensures the redirect works reliably regardless of route nesting.
    console.log(
      `Authenticated user attempting to access guest route: ${to.path}. Redirecting to Dashboard.`
    );
    return next({ path: "/dashboard" });
  }

  // 3. Role Check (Must be placed after initial authentication check)
  if (to.meta.roles && isAuthenticated) {
    const allowedRoles = to.meta.roles as string[];

    if (userRole && !allowedRoles.includes(userRole)) {
      console.warn(
        `Access denied for role: ${userRole}. Redirecting to Dashboard.`
      );
      // Redirect unauthorized roles back to the main dashboard
      return next({ path: "/dashboard" });
    }
  }

  next();
});

export default router;
