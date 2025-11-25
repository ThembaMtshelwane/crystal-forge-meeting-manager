import { ILinks } from "@/types/sidebar.types.js";

export const sidebarLinks: ILinks[] = [
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
