import { createWebHashHistory, createRouter } from "vue-router";
import HomePage from "../views/HomePage.vue";
import SettingsPage from "../views/SettingsPage.vue";
import ReportsPage from "../views/ReportsPage.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/index.html",
    name: "HomePageIndex",
    component: HomePage,
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsPage,
  },
  {
    path: "/reports",
    name: "Reports",
    component: ReportsPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(
    process.env.NODE_ENV === "development" ? "./" : "/sites/89cs/GNOC/MSL/"
  ),
  routes,
});

export default router;
