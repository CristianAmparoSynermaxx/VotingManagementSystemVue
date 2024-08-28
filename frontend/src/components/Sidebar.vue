<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import Account from "./Account.vue";

const props = defineProps({
  isSidebarOpen: Boolean,
  handleToggleAccount: Function,
});

const dropDown = ref(false); // Dropdown state

// Router instance
const router = useRouter();

// Toggle functions
const toggleDropDown = () => {
  dropDown.value = !dropDown.value;
};

// Logout function
const logout = () => {
  Swal.fire({
    icon: "question",
    title: "Logout",
    text: "Are you sure you want to log out?",
    showCancelButton: true,
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("userData"); // Clear local storage

      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1200,
      });

      router.push("/"); // Redirect to home
    }
  });
};
</script>

<template>
  <aside
    class="fixed top-20 left-0 xl:translate-x-0 z-40 w-full md:w-72 h-screen transition-transform"
    :class="[props.isSidebarOpen ? 'translate-x-0' : '-translate-x-full']"
  >
    <div class="h-full px-3 py-4 bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li>
          <router-link class="sidebarList" to="/admin">
            <img class="icon" src="/dashboard.png" alt="Dashboard" />
            <span class="ms-3">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link class="sidebarList" to="/admin/voteinfo">
            <img class="icon" src="/votedetails.png" alt="Votes Information" />
            <span class="flex-1 ms-3 whitespace-nowrap">Votes Information</span>
          </router-link>
        </li>
        <li>
          <router-link class="sidebarList" to="/admin/result">
            <img class="icon" src="/results.png" alt="Result" />
            <span class="flex-1 ms-3 whitespace-nowrap">Result</span>
          </router-link>
        </li>
        <li>
          <button
            type="button"
            class="flex items-center w-full p-2 text-base transition duration-75 rounded-lg group text-white hover:bg-gray-700"
            @click="toggleDropDown"
          >
            <img class="icon" src="/manage.png" alt="Manage" />
            <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap"
              >Manage</span
            >
            <img
              :class="{ 'rotate-180': dropDown }"
              class="icon"
              src="/dropdown.png"
              alt="Dropdown"
            />
          </button>
          <ul :class="{ hidden: !dropDown }" class="py-2 space-y-2">
            <li>
              <router-link
                to="/admin/candidates"
                class="flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700"
              >
                Candidates
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/users"
                class="flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700"
              >
                Users
              </router-link>
            </li>
          </ul>
        </li>
        <li class="sidebarList cursor-pointer" @click="handleToggleAccount">
          <img class="icon" src="/admin.png" alt="Account Settings" />
          <span class="flex-1 ms-3 whitespace-nowrap">Account Settings</span>
        </li>
        <li class="sidebarList cursor-pointer" @click="logout">
          <img class="icon" src="/logout.png" alt="Logout" />
          <span class="flex-1 ms-3 whitespace-nowrap">Logout</span>
        </li>
      </ul>
    </div>
  </aside>
</template>
