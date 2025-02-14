import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
// Routes configuration
const routes = [
  // Public routes
  {
    path: "/",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false, requiresNavbar: false }, // No auth required
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/SignUpView.vue"),
    meta: { requiresAuth: false, requiresNavbar: false }, // No auth required
  },

  // User routes (requires authentication)
  {
    path: "/user",
    component: () => import("@/layout/UserLayout.vue"),
    meta: { requiresAuth: true, requiresNavbar: true }, // Requires user to be authenticated
    children: [
      {
        path: "",
        redirect: "user/content",
      },
      {
        path: "content",
        name: "content",
        component: () => import("@/views/user/ContentView.vue"),
      },
      {
        path: "ballot",
        name: "ballot",
        component: () => import("@/views/user/BallotView.vue"),
      },
      {
        path: "donevoting",
        name: "done-voting",
        component: () => import("@/views/user/DoneVotingView.vue"),
      },
      {
        path: "editresponse",
        name: "edit-response",
        component: () => import("@/views/user/EditResponseView.vue"),
      },
      {
        path: "electionended",
        name: "election-ended",
        component: () => import("@/views/user/ElectionEndedView.vue"),
      },
    ],
  },

  // Admin routes (requires authentication and admin role)
  {
    path: "/admin",
    component: () => import("@/layout/AdminLayout.vue"),
    meta: { requiresAuth: true, requiresAdmin: true, requiresNavbar: true }, // Requires both auth and admin role
    children: [
      {
        path: "",
        redirect: "admin/dashboard",
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/admin/DashboardView.vue"),
      },
      {
        path: "votesinfo",
        name: "votesinfo",
        component: () => import("@/views/admin/VotesInfoView.vue"),
      },
      {
        path: "result",
        name: "result",
        component: () => import("@/views/admin/ResultView.vue"),
      },
      {
        path: "candidates",
        name: "candidates",
        component: () => import("@/views/admin/CandidatesView.vue"),
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/views/admin/UsersView.vue"),
      },
    ],
  },

  // Catch-all route
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check user roles and authentication
router.beforeEach((to, from, next) => {
  const userData = JSON.parse(localStorage.getItem("userData")); // Retrieve user data from local storage

  if (to.meta.requiresAuth && !userData) {
    next({ name: "login" }); // Redirect to login
  } else if (
    to.meta.requiresAdmin &&
    (!userData || userData.username !== "admin@gmail.com")
  ) {
    next({ name: "content" }); // Redirect non-admin users
  } else if ((to.name === "login" || to.name === "signup") && userData) {
    next({ name: "content" }); // Redirect logged-in users
  } else {
    next();
  }
});

export default router;
