<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import Account from "./Account.vue";
import Sidebar from "./Sidebar.vue";
import { GetHeaders } from "@/utils/GetHeaders";
import { useRoute, useRouter } from "vue-router";

const headers = GetHeaders();
const router = useRouter();
const route = useRoute();

// Compute the base path from the current route's path
const basePath = computed(() => {
  const segments = route.path.split("/");
  return segments[1];
});

const profile = ref();
const toggleProfile = ref(false);
const toggleAccount = ref(false);

const isSidebarOpen = ref(false);

const apiHost = import.meta.env.VITE_host;
const adminKey = import.meta.env.VITE_adminKey;

const userData = localStorage.getItem("userData");
const userId = userData ? JSON.parse(userData).id : null;

// Function to fetch the user data from the API
const fetchUserData = async () => {
  try {
    if (userId !== null) {
      const response = await axios.get(`${apiHost}api/users/${userId}`, {
        headers,
      });
      if (response.data) {
        profile.value = response.data[0].image;
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Functions to toggle profile and account visibility
const handleToggleProfile = () => {
  toggleProfile.value = !toggleProfile.value;
};

const handleToggleAccount = () => {
  toggleAccount.value = !toggleAccount.value;
  toggleProfile.value = false;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen?.value;
};
// Logout function
const logout = () => {
  localStorage.removeItem("userData");
  router.push("/");
};

// Fetch the user data when the component is mounted
onMounted(() => {
  fetchUserData();

  // Optional: if you want to fetch periodically
  const intervalId = setInterval(fetchUserData, 10000);

  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <header>
    <div
      v-if="basePath !== 'admin'"
      class="fixed top-0 right-0 left-0 flex justify-between px-3 md:px-10 items-center h-20 bg-primary shadow-xl z-50"
    >
      <div class="flex items-center gap-5">
        <h1 class="text-2xl md:text-3xl font-sans font-bold textShadow">
          <span class="text-gray-200 pr-1">Voting</span>System!
        </h1>
      </div>
      <div class="flex items-center">
        <div
          class="profile flex justify-center w-8 cursor-pointer outline outline-1 outline-black outline-offset-1 rounded-full hover:scale-105"
          @click="handleToggleProfile"
        >
          <img
            class="w-8 h-8 md:w-8 md:h-8 rounded-full object-contain bg-white cursor-pointer hover:scale-105"
            :src="profile ? `${apiHost}/uploads/${profile}` : '/profile.png'"
            alt=""
          />
        </div>
      </div>

      <!-- Profile dropdown menu -->
      <div
        v-if="toggleProfile"
        class="absolute right-1 top-[85px] bg-white rounded-md shadow-md"
      >
        <ul class="font-bold">
          <li
            class="flex p-3 items-center hover:bg-gray-200 cursor-pointer"
            @click="handleToggleAccount"
          >
            <img class="icon invert" src="/admin.png" alt="" />
            <span class="flex-1 ms-3 whitespace-nowrap text-black"
              >Account Settings</span
            >
          </li>
          <RouterLink to="/">
            <li
              class="flex p-3 items-center hover:bg-gray-200 cursor-pointer"
              @click="logout"
            >
              <img class="icon invert" src="/logout.png" alt="" />
              <span class="flex-1 ms-3 whitespace-nowrap text-black"
                >Logout</span
              >
            </li>
          </RouterLink>
        </ul>
      </div>
    </div>

    <div v-else>
      <div
        className="fixed top-0 right-0 left-0 flex justify-between px-10 items-center h-20 bg-orange-500 shadow-xl z-50"
      >
        <div className="flex items-center gap-5">
          <h1 className="text-2xl md:text-3xl font-sans font-bold textShadow">
            <span className="text-gray-200 pr-1">Voting</span>System!
          </h1>
        </div>
        <div
          className="profile flex justify-center w-10 cursor-pointer hover:scale-105 relative"
        >
          <div
            @click="toggleSidebar"
            className="w-6 h-6 md:w-8 md:h-8 cursor-pointer block xl:hidden hover:scale-105"
          >
            <img v-if="isSidebarOpen" src="/close.png" alt="" />
            <img v-else src="/menu.png" alt="" />
          </div>
          <p className="profileName absolute -bottom-8">
            {{ isSidebarOpen ? "Close Sidebar" : "Open Sidebar" }}
          </p>
        </div>
      </div>
      <Sidebar
        :isSidebarOpen="isSidebarOpen"
        :handleToggleAccount="handleToggleAccount"
      />
    </div>
  </header>

  <!-- Account component -->
  <Account
    v-if="toggleAccount"
    :handleToggleAccount="handleToggleAccount"
    :toggleAccount="toggleAccount"
  />
</template>
