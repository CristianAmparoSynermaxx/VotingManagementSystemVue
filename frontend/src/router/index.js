import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ContentView from "@/views/ContentView.vue";
import SignUpView from "@/views/SignUpView.vue";
import BallotView from "@/views/BallotView.vue";
import DoneVotingView from "@/views/DoneVotingView.vue";
import EditResponseView from "@/views/EditResponseView.vue";
import ElectionEndedView from "@/views/ElectionEndedView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresNavbar: false },
    },
    {
      path: '/signup',
      name: 'sign-up',
      component: SignUpView,
      meta: { requiresNavbar: false },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresNavbar: true },
    },
    {
      path: '/Content',
      name: 'content',
      component: ContentView,
      meta: { requiresNavbar: true },
    },
    {
      path: '/ballot',
      name: 'ballot',
      component: BallotView,
      meta: { requiresNavbar: true },
    },
    {
      path: '/donevoting',
      name: 'done-voting',
      component: DoneVotingView,
      meta: { requiresNavbar: true },
    },
    {
      path: '/editresponse',
      name: 'edit-response',
      component: EditResponseView,
      meta: { requiresNavbar: true },
    },
    {
      path: '/electionended',
      name: 'electionended',
      component: ElectionEndedView,
      meta: { requiresNavbar: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
      meta: { requiresNavbar: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData && to.name === 'sign-up') {
    next(); // Allow access to the signup route
  } else if (!userData && to.name !== 'login') {
    // If userData does not exist and the user is not on the login page, redirect to login
    next({ name: 'login' });
  } else if (userData && to.name === 'login') {
    // If userData exists and the user tries to access the login page, redirect to home
    next({ name: 'content' });
  } else {
    next(); // Allow the navigation
  }
});



export default router;
