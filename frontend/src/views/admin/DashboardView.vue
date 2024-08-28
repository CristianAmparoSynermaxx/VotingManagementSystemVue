<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import VotingDuration from "@/components/VotingDuration.vue";
import VoteTally from "@/components/VoteTally.vue";
import DurationModal from "@/components/DurationModal.vue";
import { GetHeaders } from "@/utils/GetHeaders";

const apiHost = import.meta.env.VITE_host;

const votesCountdata = ref([]);
const usersCountdata = ref([]);
const headers = GetHeaders();
const isDurationModalOpen = ref(false);

const toggleDurationModal = () => {
  isDurationModalOpen.value = !isDurationModalOpen.value;
};

const totalVotesCount = computed(() =>
  votesCountdata.value
    ? (votesCountdata.value.votes_count || 0).toString().padStart(2, "0")
    : "00"
);

const totalUsersCount = computed(() =>
  usersCountdata.value
    ? (usersCountdata.value.voters_count || 0).toString().padStart(2, "0")
    : "00"
);

const fetchTotalVotes = async () => {
  try {
    const response = await axios.get(`${apiHost}api/votes/totalVotes`, {
      headers,
    });
    votesCountdata.value = response.data[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchTotalUsers = async () => {
  try {
    const response = await axios.get(`${apiHost}api/votes/totalVoters`, {
      headers,
    });
    usersCountdata.value = response.data[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  const intervalId = setInterval(() => {
    fetchTotalVotes();
    fetchTotalUsers();
  }, 3000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <section
    class="overflow-y-auto fixed top-20 left-0 xl:left-72 bottom-0 right-0 flex flex-col items-start md:items-center justify-center'"
  >
    <section class="p-5">
      <h1
        class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-left pb-5"
      >
        <span class="text-orange-600">Dashboard</span> Page
      </h1>
      <div class="text-white flex flex-col lg:flex-row gap-5 items-center">
        <div class="flex gap-5">
          <div
            class="px-4 py-2 bg-secondary-100 shadow-lg rounded-3xl w-44 md:w-56 xl:w-72 xl:h-40 h-32"
          >
            <div class="flex justify-between items-center w-full">
              <span class="text-lg font-bold">Total Votes</span>
              <router-link to="voteinfo"
                ><img class="w-6 h-6" src="/details.png" alt=""
              /></router-link>
            </div>
            <div class="w-full h-4/6 flex items-center justify-center">
              <img class="w-8" src="/votes.png" alt="" />
              <div class="text-7xl pb-1 pl-1 font-bold">
                {{ totalVotesCount }}
              </div>
            </div>
          </div>
          <div
            class="px-4 py-2 bg-secondary-200 shadow-lg rounded-3xl w-44 md:w-56 xl:w-72 xl:h-40 h-32"
          >
            <div class="flex justify-between items-center w-full">
              <span class="text-lg font-bold">Total Voters</span>
              <router-link to="users"
                ><img class="w-6 h-6" src="/details.png" alt=""
              /></router-link>
            </div>
            <div class="w-full h-4/6 flex items-center justify-center">
              <img class="w-8" src="/voters.png" alt="" />
              <span class="text-7xl pb-1 pl-1 font-bold">{{
                totalUsersCount
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="px-4 py-2 bg-secondary-300 shadow-lg rounded-3xl w-96 xl:h-40 h-32"
        >
          <div class="flex justify-between items-center w-full">
            <span class="text-lg font-bold">Election Duration</span>
            <button @click="toggleDurationModal">
              <img class="w-6 h-6" src="/details.png" alt="" />
            </button>
          </div>
          <VotingDuration :admin="true" />
        </div>
      </div>
      <VoteTally />
    </section>
    <DurationModal
      v-if="isDurationModalOpen"
      :toggleDurationModal="toggleDurationModal"
    />
  </section>
</template>
