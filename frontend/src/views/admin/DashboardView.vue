<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import VotingDuration from "@/components/VotingDuration.vue";
import VoteTally from "@/components/VoteTally.vue";
import DurationModal from "@/components/DurationModal.vue";
import { GetHeaders } from "@/utils/GetHeaders";
import axios from "axios";

const apiHost = import.meta.env.VITE_host;
const headers = GetHeaders();
const isDurationModalOpen = ref(false);
const votesCountdata = ref([]);
const usersCountdata = ref([]);

const toggleDurationModal = () => {
  isDurationModalOpen.value = !isDurationModalOpen.value;
};

const totalVotesCount = computed(() =>
  (votesCountdata.value?.votes_count || 0).toString().padStart(2, "0")
);

const totalUsersCount = computed(() =>
  (usersCountdata.value?.voters_count || 0).toString().padStart(2, "0")
);

const fetchData = async (url, dataRef) => {
  try {
    const response = await axios.get(`${apiHost}${url}`, { headers });
    dataRef.value = response.data[0];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};

const fetchVotesAndUsersData = () => {
  fetchData("api/votes/totalVotes", votesCountdata);
  fetchData("api/votes/totalVoters", usersCountdata);
};

onMounted(() => {
  fetchVotesAndUsersData();
  const intervalId = setInterval(fetchVotesAndUsersData, 3000);

  onUnmounted(() => clearInterval(intervalId));
});
</script>

<template>
  <section class="p-5 w-full">
    <h1
      class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-left pb-5"
    >
      <span class="text-orange-600">Dashboard</span> Page
    </h1>
    <div class="text-white flex flex-col lg:flex-row gap-5 items-center">
      <div className="flex gap-5">
        <div
          className="px-4 py-2 bg-secondary-100 shadow-lg rounded-3xl w-44 md:w-56 xl:w-72 xl:h-40 h-32"
        >
          <div className="flex justify-between items-center w-full ">
            <span className="text-lg font-bold">Total Votes</span>
            <router-link to="/admin/voteinfo"
              ><img className="w-6 h-6" src="/details.png" alt=""
            /></router-link>
          </div>
          <div className="w-full h-4/6 flex items-center justify-center ">
            <img className="w-8" src="/votes.png" alt="" />
            <div className="text-7xl  pb-1 pl-1 font-bold ">
              {{ totalVotesCount }}
            </div>
          </div>
        </div>
        <div
          className="px-4 py-2 bg-secondary-200 shadow-lg rounded-3xl w-44 md:w-56 xl:w-72 xl:h-40 h-32"
        >
          <div className="flex justify-between items-center w-full ">
            <span className="text-lg font-bold">Total Voters</span>
            <router-link to="/admin/users"
              ><img className="w-6 h-6" src="/details.png" alt=""
            /></router-link>
          </div>
          <div className="w-full h-4/6 flex items-center justify-center ">
            <img className="w-8" src="/voters.png" alt="" />
            <span className="text-7xl  pb-1 pl-1 font-bold">{{
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
    <DurationModal
      v-if="isDurationModalOpen"
      :toggleDurationModal="toggleDurationModal"
    />
  </section>
</template>
